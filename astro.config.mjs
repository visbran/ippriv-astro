// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ippriv.com',
  output: 'static', // SSG mode
  
  integrations: [
    react(),
    sitemap({
      // Configuration du sitemap
      filter: (page) => 
        // Exclure les pages API
        !page.includes('/api/'),
      
      // Personnaliser les priorités et fréquences
      changefreq: 'weekly',
      priority: 0.7,
      
      // Configuration personnalisée pour les pages importantes
      customPages: [
        'https://www.ippriv.com/',
        'https://www.ippriv.com/ip-lookup',
        'https://www.ippriv.com/blog'
      ]
    })
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});