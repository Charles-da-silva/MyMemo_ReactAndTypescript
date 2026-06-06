import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build v2
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
  },
  base: '/'
})
