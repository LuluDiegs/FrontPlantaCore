import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7123/api/v1';
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
  headers: {
    'Content-Type': 'application/json',
  },
});

if (IS_MOCK) {
  import('../mocks/mockAdapter').then(({ default: mockAdapter }) => {
    api.defaults.adapter = mockAdapter;
    console.log('%c[PlantID] Modo Mock ativado', 'color: #52B788; font-weight: bold');
  });
}

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

    if (config.data && typeof config.data === 'object') {
      config.data = transformKeysToPascalCase(config.data);
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

      const { data } = await axios.post(`${API_BASE_URL}/Autenticacao/refresh-token`, {
        tokenRefresh: refreshToken,
      });

      if (data.sucesso && data.dados) {
        const newTokens = {
          tokenAcesso: data.dados.tokenAcesso,
          tokenRefresh: data.dados.tokenRefresh,
        };

        // Atualiza o Zustand store via localStorage
        const currentState = JSON.parse(stored);
        currentState.state.tokens = newTokens;
        localStorage.setItem('plantid-auth', JSON.stringify(currentState));

        originalRequest.headers.Authorization = `Bearer ${newTokens.tokenAcesso}`;
        processQueue(null, newTokens.tokenAcesso);

        return api(originalRequest);
      }

      throw new Error('Refresh failed');
    } catch (refreshError) {
      processQueue(refreshError, null);

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
