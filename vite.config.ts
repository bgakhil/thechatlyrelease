import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // use "/" if you're deploying to www.thechatly.com root
  plugins: [react()],
})
