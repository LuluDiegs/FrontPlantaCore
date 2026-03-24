import api from '../../../lib/axios';

export const postService = {
  create: async (payload) => {
    const { data } = await api.post('/Post', payload);
    return data;
  },
};