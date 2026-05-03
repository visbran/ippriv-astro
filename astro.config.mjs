// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://www.ippriv.com';

// Priorités par page
const PAGE_PRIORITIES = {
  [`${SITE}`]: { priority: 1.0, changefreq: 'daily' },
  [`${SITE}/ip-lookup`]: { priority: 0.9, changefreq: 'weekly' },
  [`${SITE}/blog`]: { priority: 0.8, changefreq: 'weekly' },
  [`${SITE}/api-docs`]: { priority: 0.7, changefreq: 'monthly' },
  [`${SITE}/about`]: { priority: 0.5, changefreq: 'monthly' },
  [`${SITE}/contact`]: { priority: 0.4, changefreq: 'monthly' },
  [`${SITE}/privacy`]: { priority: 0.3, changefreq: 'yearly' },
  [`${SITE}/terms`]: { priority: 0.3, changefreq: 'yearly' },
  [`${SITE}/legal`]: { priority: 0.3, changefreq: 'yearly' },
};

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static', // SSG mode
  trailingSlash: 'never',

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/') && !page.includes('/blog/archive'),
      serialize(item) {
        const custom = PAGE_PRIORITIES[item.url];
        if (custom) {
          item.priority = custom.priority;
          item.changefreq = custom.changefreq;
        } else if (item.url.includes('/blog/')) {
          // Articles de blog
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        item.lastmod = new Date().toISOString().split('T')[0];
        return item;
      },
    })
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});