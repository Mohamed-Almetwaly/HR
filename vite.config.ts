import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: './', // لاحظ النقطة قبل الشرطة المائلة
})