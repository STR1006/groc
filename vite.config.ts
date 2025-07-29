// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the 'path' module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This is the crucial part for resolving "@/..." imports
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // If you have a base path for deployment, ensure it's here
  // For example, if deployed to example.com/groc/
  base: '/groc/', // Adjust this if your deployment path is different
});