# IPPriv

Frontend for [ippriv.com](https://www.ippriv.com) — privacy-focused IP lookup and geolocation tools built with Astro 5.

## Tech Stack

- **[Astro 5](https://astro.build)** — SSG with static output
- **[React 19](https://react.dev)** + **[TypeScript](https://www.typescriptlang.org)**
- **[Tailwind CSS 4](https://tailwindcss.com)** + **[shadcn/ui](https://ui.shadcn.com)**
- **[Resend](https://resend.com)** — contact form email
- **[Plausible](https://plausible.io)** — privacy-friendly analytics
- **[Vercel](https://vercel.com)** — hosting + serverless functions

## Project Structure

```
/
├── api/
│   └── contact.ts          # Vercel serverless function (contact form)
├── public/
├── src/
│   ├── components/         # React + Astro components
│   ├── content/
│   │   └── blog/           # Markdown blog articles
│   ├── layouts/            # Page layouts
│   ├── pages/              # File-based routing
│   ├── styles/             # Global CSS
│   └── utils/              # Helpers
├── astro.config.mjs
├── vercel.json             # Security headers + cache rules
└── .env.example
```

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in RESEND_API_KEY in .env

# Start dev server
npm run dev        # http://localhost:4321

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PUBLIC_API_URL` | IPPriv API base URL | Yes |
| `PUBLIC_SITE_URL` | Public site URL | Yes |
| `RESEND_API_KEY` | Resend API key for contact form | Yes |

> `RESEND_API_KEY` is server-side only — never prefix with `PUBLIC_`.

## Blog

Articles live in `src/content/blog/` as Markdown files. Set `draft: true` in frontmatter to hide an article from production builds.

```yaml
---
title: 'My Article'
publishedAt: 2026-03-12
draft: true   # hidden in production, visible in dev
---
```

## Deployment

Deployed automatically on Vercel from the `master` branch. Add all environment variables in **Vercel → Settings → Environment Variables**.

The `api/` directory is auto-detected by Vercel as serverless functions.

## License

© 2025 [LMF Solutions](https://www.ippriv.com/legal). All rights reserved.
