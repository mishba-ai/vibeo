import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { resolve } from 'path'; 

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@/': resolve(__dirname, './src'),
      '@repo/ui/': resolve(__dirname, '../../packages/ui/src/') 
    },
  },
})