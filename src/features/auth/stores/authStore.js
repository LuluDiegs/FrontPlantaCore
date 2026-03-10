import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      tokens: null,

      setAuth: (loginData) => {
        set({
          user: {
            id: loginData.usuarioId,
            nome: loginData.nome,
            email: loginData.email,
            fotoPerfil: loginData.fotoPerfil || null,
          },
          tokens: {
            tokenAcesso: loginData.tokenAcesso,
            tokenRefresh: loginData.tokenRefresh,
          },
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      clearAuth: () => {
        set({ user: null, tokens: null });
      },
    }),
    {
      name: 'plantid-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
      }),
    },
  ),
);
