import api from '../../../shared/services/api';

export const postService = {
  create: async (payload) => {
    const { data } = await api.post('/Post', payload);
    return data;
  },
};