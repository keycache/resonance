// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://keycache.github.io',
  base: '/resonance', // Only if NOT using a custom domain
  vite: {
    plugins: [tailwindcss()]
  }
});