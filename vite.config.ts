import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/HR/', // هذا السطر يخبر Vite أن يضع المسارات بشكل صحيح للموقع
})