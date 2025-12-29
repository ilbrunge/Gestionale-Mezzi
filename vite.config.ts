
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Casting process to any to access cwd() when Node types are not correctly inferred
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.COMPANY_CODE': JSON.stringify(env.COMPANY_CODE),
    },
    server: {
      port: 3000
    }
  };
});
