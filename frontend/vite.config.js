import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Auth Service Proxy (Port 3001)
      '/api/v1/signup': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/v1/signin': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/v1/isAuthenticated': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/v1/isAdmin': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },

      // Flight Search Service Proxy (Port 3000)
      '/api/v1/flights': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api/v1/airports': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api/v1/cities': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api/v1/airplanes': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },

      // Flight Booking Service Proxy (Port 4000)
      '/api/v1/bookings': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1\/bookings/, '/api/v1/bookings')
      },

      // Reminder Service Proxy (Port 3004)
      '/api/v1/tickets': {
        target: 'http://localhost:3004',
        changeOrigin: true,
      },

      // Gateway Proxy (Port 5000)
      '/gateway': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gateway/, '')
      }
    }
  }
})
