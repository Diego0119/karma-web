import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['axios'],
          pdf: ['jspdf', 'html2canvas'],
          qr: ['qrcode.react', 'html5-qrcode'],
        },
      },
    },
  },
})
