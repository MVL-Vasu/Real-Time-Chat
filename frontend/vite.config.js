import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: '/real-time-chat/',
  plugins: [react()],
  // proxy: {
  //   '/api': 'http://127.0.0.1:3001',
  // },
  // server: {
  //   host: '0.0.0.0', // Allow access from any IP on the network
  //   port: 3000,       // Port to use (you can change if needed)
  // },
})

