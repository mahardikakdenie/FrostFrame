import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.UNSPLASH_ACCESS_KEY': JSON.stringify(env.UNSPLASH_ACCESS_KEY),
      'process.env.UNSPLASH_APP_ID': JSON.stringify(env.UNSPLASH_APP_ID),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3003,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
