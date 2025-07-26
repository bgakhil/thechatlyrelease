// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 ADD THIS LINE
const base = '/thechatlyrelease/';

export default defineConfig({
  base, // 👈 This tells Vite your app is not at root
  plugins: [react()],
})
