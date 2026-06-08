import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // قمنا بتغييرها إلى مسار نسبي لضمان عمل الملفات
})