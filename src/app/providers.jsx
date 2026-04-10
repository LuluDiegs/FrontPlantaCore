import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '../lib/queryClient';

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'var(--font-base)',
            borderRadius: 'var(--radius-sm)',
          },
          success: {
            style: {
              background: 'var(--color-soft)',
              color: 'var(--color-forest)',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
