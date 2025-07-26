import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 Add base path for GitHub Pages
export default defineConfig({
  base: '/thechatlyrelease/',
  plugins: [react()],
})
