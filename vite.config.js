import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If you deploy to GitHub Pages under https://<user>.github.io/CAR-GO-ME/
// keep base as '/CAR-GO-ME/'. Change or remove if using a different host.
export default defineConfig({
  base: '/CAR-GO-ME/',
  plugins: [react()]
})
