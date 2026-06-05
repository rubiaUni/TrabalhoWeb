import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Config minima do Vite.
// - porta do dev server vem de env (fallback 5173)
// - proxy de /api -> backend para evitar CORS: o browser fala same-origin
//   com o dev server, que encaminha (server-side) para a API existente.
//   O alvo do proxy usa o NOME do servico Docker (rede compartilhada).
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://backend:3000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
});
