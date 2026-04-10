import axios from 'axios';
import { useAuthStore } from '../features/auth/stores/authStore';

// Prefer explicit `VITE_API_URL` in env; otherwise call same-origin `/api/v1`
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const IS_MOCK = import.meta.env.VITE_MOCK_API === 'true';

const toCamelCase = (str) => {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const transformKeysToCamelCase = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(transformKeysToCamelCase);

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = toCamelCase(key);
    acc[camelKey] = transformKeysToCamelCase(obj[key]);
    return acc;
  }, {});
};

const toPascalCase = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const transformKeysToPascalCase = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(transformKeysToPascalCase);

  return Object.keys(obj).reduce((acc, key) => {
    const pascalKey = toPascalCase(key);
    acc[pascalKey] = transformKeysToPascalCase(obj[key]);
    return acc;
  }, {});
};

const api = axios.create({
  baseURL: API_BASE_URL,
  transformRequest: [
    (data) => {
      // Se for FormData, retorna como está (não transforma)
      if (data instanceof FormData) {
        return data;
      }
      // Caso contrário, serializa como JSON
      if (data) {
        return JSON.stringify(data);
      }
      return data;
    },
  ],
});

// Interceptor para gerenciar headers baseado no tipo de dado
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // FormData: remover Content-Type manualmente para deixar FormData gerar multipart/form-data
    delete config.headers['Content-Type'];
  } else if (config.data) {
    // JSON: setar Content-Type como JSON
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// NOTE: Mock adapter removed to force usage of the real backend API.
// To enable mocks locally for debugging, re-enable the import above intentionally.

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('plantid-auth');
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        const token = state?.tokens?.tokenAcesso;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // localStorage corrompido, ignora
      }
    }

    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
      // Allow requests to opt-out of PascalCase transform by setting header `X-Skip-PascalCase: true`.
      const skip = config.headers && (config.headers['X-Skip-PascalCase'] === true || config.headers['x-skip-pascalcase'] === 'true');
      if (!skip) {
        config.data = transformKeysToPascalCase(config.data);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = transformKeysToCamelCase(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Log 401 for visibility
    // eslint-disable-next-line no-console
    console.warn('[axios] request failed with status', error.response?.status, 'url', originalRequest?.url);

    // Log response body when available to help debugging 400/500 errors
    // eslint-disable-next-line no-console
    if (error.response?.data) console.error('[axios] response body:', error.response.data);

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/Autenticacao/login') ||
      originalRequest.url?.includes('/Autenticacao/refresh-token')
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const stored = localStorage.getItem('plantid-auth');
      if (!stored) throw new Error('No auth data');

      const { state } = JSON.parse(stored);
      const refreshToken = state?.tokens?.tokenRefresh;
      if (!refreshToken) throw new Error('No refresh token');

      // Log attempt (masked token) for debugging
      try {
        // eslint-disable-next-line no-console
        const masked = typeof refreshToken === 'string' && refreshToken.length > 8 ? `${refreshToken.slice(0,6)}...${refreshToken.slice(-4)}` : refreshToken;
        // eslint-disable-next-line no-console
        console.info('[axios] attempting token refresh with refreshToken=', masked);
      } catch (e) {
        // ignore logging errors
      }

      const refreshResp = await axios.post(`${API_BASE_URL}/Autenticacao/refresh-token`, {
        tokenRefresh: refreshToken,
      });

      const refreshBody = refreshResp?.data;
      // Log response for diagnostics
      try {
        // eslint-disable-next-line no-console
        console.info('[axios] refresh endpoint status=', refreshResp.status, 'body=', refreshBody);
      } catch (e) {
        // ignore
      }

      // Accept either wrapped { sucesso, dados: { tokenAcesso, tokenRefresh } }
      // or direct { tokenAcesso, tokenRefresh }
      // Try multiple shapes for token payload to be resilient to backend variations
      const extractTokens = (body) => {
        if (!body || typeof body !== 'object') return null;

        // direct
        if (body.tokenAcesso && body.tokenRefresh) return { tokenAcesso: body.tokenAcesso, tokenRefresh: body.tokenRefresh };

        // dados.{tokenAcesso,tokenRefresh}
        if (body.dados && body.dados.tokenAcesso && body.dados.tokenRefresh) {
          return { tokenAcesso: body.dados.tokenAcesso, tokenRefresh: body.dados.tokenRefresh };
        }

        // dados.tokens or dados.tokens.{tokenAcesso,tokenRefresh}
        if (body.dados && body.dados.tokens && body.dados.tokens.tokenAcesso && body.dados.tokens.tokenRefresh) {
          return { tokenAcesso: body.dados.tokens.tokenAcesso, tokenRefresh: body.dados.tokens.tokenRefresh };
        }

        // nested one-level (ex.: sucesso:true, dados:{ tokens: { access, refresh } })
        if (body.tokens && body.tokens.tokenAcesso && body.tokens.tokenRefresh) {
          return { tokenAcesso: body.tokens.tokenAcesso, tokenRefresh: body.tokens.tokenRefresh };
        }

        // fallback: maybe different naming (accessToken/refreshToken)
        if (body.accessToken && body.refreshToken) return { tokenAcesso: body.accessToken, tokenRefresh: body.refreshToken };
        if (body.dados && body.dados.accessToken && body.dados.refreshToken) return { tokenAcesso: body.dados.accessToken, tokenRefresh: body.dados.refreshToken };

        return null;
      };

      let newTokens = extractTokens(refreshBody);

      if (!newTokens) throw new Error('Refresh failed or returned unexpected payload');

      // Atualiza o Zustand store via localStorage
      const currentState = JSON.parse(stored);
      currentState.state = currentState.state || {};
      currentState.state.tokens = newTokens;
      localStorage.setItem('plantid-auth', JSON.stringify(currentState));

      // Also sync tokens into the in-memory Zustand store so app state stays consistent
      try {
        if (useAuthStore && typeof useAuthStore.setState === 'function') {
          // Merge tokens into existing state
          useAuthStore.setState((s) => ({ ...s, tokens: newTokens }));
        }
      } catch (e) {
        // ignore sync errors
      }

      originalRequest.headers.Authorization = `Bearer ${newTokens.tokenAcesso}`;
      processQueue(null, newTokens.tokenAcesso);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // eslint-disable-next-line no-console
      console.error('[axios] refresh failed:', refreshError);

      // Limpa auth e redireciona para login
      localStorage.removeItem('plantid-auth');
      window.location.href = '/login';

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
