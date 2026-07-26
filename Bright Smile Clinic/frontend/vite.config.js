import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Local dev only: frontend (Vite) and backend (Express) run on separate
    // ports here, unlike production where one Express server serves both from
    // the same origin. Proxying lets the app code use relative '/api' calls
    // and a same-origin socket.io connection in both environments, instead of
    // hardcoding a localhost URL that would break in production.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
