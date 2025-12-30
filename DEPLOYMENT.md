# 🚀 IPPriv - Deployment Guide

## 📋 Pre-deployment Checklist

- [x] Build successful
- [x] All pages working
- [x] API connected to production
- [x] SEO complete
- [x] Analytics configured
- [x] Performance optimized
- [x] Security headers configured
- [x] 404 page added
- [x] View Transitions enabled

---

## 🌐 Cloudflare Pages Deployment

### Initial Setup

1. **Connect GitHub Repository**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com)
   - Click "Create a project"
   - Select your GitHub repository

2. **Build Configuration**
   ```
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```

3. **Environment Variables**
   ```
   PUBLIC_API_URL=https://api.ippriv.com
   PUBLIC_SITE_URL=https://www.ippriv.com
   NODE_VERSION=18
   ```

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete (~2-3 minutes)

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run astro check
```

---

## 📦 Build Output

```
dist/
├── index.html
├── about/
│   └── index.html
├── api-docs/
│   └── index.html
├── ip-lookup/
│   └── index.html
├── contact/
│   └── index.html
├── privacy/
│   └── index.html
├── terms/
│   └── index.html
├── 404.html
├── _astro/
│   ├── *.js (code-split chunks)
│   └── *.css
└── [public assets]
```

---

## ⚡ Performance Optimizations Applied

### 1. Client Directives
- `client:load` → Hero only (above fold)
- `client:idle` → Header (after main thread idle)
- `client:visible` → Features, HowItWorks, Social, CTA

### 2. View Transitions
- Smooth SPA-like navigation between pages
- Native browser API (no extra JS)

### 3. Resource Hints
- Preconnect to fonts.googleapis.com
- Preload critical font files

### 4. Security Headers
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Content-Security-Policy configured
- Referrer-Policy: strict-origin-when-cross-origin

---

## 📊 Expected Performance

### Lighthouse Scores (Production)
- Performance: 95-100
- Accessibility: 95-100
- Best Practices: 95-100
- SEO: 100

### Core Web Vitals
- LCP (Largest Contentful Paint): < 1.5s
- FID (First Input Delay): < 50ms
- CLS (Cumulative Layout Shift): < 0.1

---

## 🔍 Post-deployment Verification

```bash
# Test all pages
curl -I https://www.ippriv.com
curl -I https://www.ippriv.com/ip-lookup
curl -I https://www.ippriv.com/api-docs
curl -I https://www.ippriv.com/about
curl -I https://www.ippriv.com/contact

# Check 404 page
curl -I https://www.ippriv.com/non-existent-page

# Verify security headers
curl -I https://www.ippriv.com | grep -i "x-frame-options"
```

---

## 📈 Monitoring

### Analytics
- **Plausible**: https://plausible.io/ippriv.com
- Privacy-friendly, no cookies
- Real-time visitor stats

### Performance
- **Cloudflare Analytics**: Built-in metrics
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Web Vitals Chrome Extension**: Real user monitoring

---

## 🐛 Troubleshooting

### Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist .astro
npm install
npm run build
```

### Preview doesn't work locally
```bash
# Make sure build completed
npm run build
npm run preview
```

### API not working
- Check `.env` file has `PUBLIC_API_URL`
- Verify API is accessible: `curl https://api.ippriv.com/api/ip`
- Check browser console for CORS errors

---

## 📞 Support

- **GitHub**: [Repository URL]
- **Email**: contact@ippriv.com
- **Author**: Brandon Visca

---

**Last Updated**: December 30, 2025
