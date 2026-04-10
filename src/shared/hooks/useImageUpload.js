import { useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

/**
 * Hook para upload de imagem ao Supabase via backend.
 *
 * @param {'foto' | 'foto-perfil' | 'foto-planta'} type - Tipo de upload
 *
 * @returns {{ upload, isUploading, progress }}
 */
export default function useImageUpload(type = 'foto') {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const endpoints = {
    'foto': '/armazenamento/foto/upload',
    'foto-perfil': '/armazenamento/foto-perfil/upload',
    'foto-planta': '/armazenamento/foto-planta/upload',
  };

  const upload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('foto', file);

    setIsUploading(true);
    setProgress(0);

    try {
      const { data } = await api.post(endpoints[type], formData, {
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      if (data.sucesso) {
        return data.url;
      }

      throw new Error(data.mensagem || 'Erro no upload');
    } catch (err) {
      const message = err.response?.data?.mensagem || 'Erro ao enviar imagem';
      toast.error(message);
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return { upload, isUploading, progress };
}
