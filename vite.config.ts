import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.COMPANY_CODE': JSON.stringify(env.COMPANY_CODE || '1234'),
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist'
    }
  };
});
