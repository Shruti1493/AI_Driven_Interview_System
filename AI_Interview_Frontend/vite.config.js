import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Specify the host
    port: 5173, // Specify the port
    strictPort: true, // Ensure the port is strictly used
  },
 
})
