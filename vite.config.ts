import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // IMPORTANT: Replace with your repository name
    base: '/GUESS-THE-NUMBER/',

    plugins: [
      react(),
      tailwindcss(),
    ],

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      // Disable HMR only if explicitly set
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});