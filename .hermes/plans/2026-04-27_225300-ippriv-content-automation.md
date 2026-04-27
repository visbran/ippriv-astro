# Plan : Automatisation de création d'articles pour ippriv.com

## Objectif
Système automatisé de production d'articles SEO pour générer du traffic organique sur ippriv.com.

---

## Contexte & Hypothèses

- Stack : Astro 5, contenu en markdown (`src/content/blog/`)
- Cible : Traffic global, content bilingue EN/FR
-，现有20 articles environ
- Repo : `/opt/ippriv-astro/`
- Convention : commits `feat/fix/docs`
- Vercel deploy

---

## Pilliers du système

### 1. Génération d'articles (AI)

**Entrée :** liste de keywords/titres cibles
**Process :**
- Recherche concurrentielle (top résultats Google pour le keyword)
- Structuration : H2/H3, intro SEO, CTA, liens internes
- Rédaction markdown avec frontmatter complet
- Image hero via Unsplash (ou génération AI)

**Sortie :** fichier `.md` dans `src/content/blog/` + flag `draft: true`

**Outil :** Agent `blog` via `hermes -p blog`

---

### 2. Pipeline SEO automatisé

Chaque article généré inclut :
- Title tag optimisé (< 60 chars)
- Meta description (150-160 chars)
- Schema `Article` (JSON-LD)
- Canonical URL
- Sitemap automatique (Astro Integration)
- Liens internes (cross-linking automatique vers articles existants)
- Tags pertinents

---

### 3. Planification & Fréquence

| Fréquence | Action |
|-----------|--------|
| Quotidien | Vérification des trends / nouveaux keywords |
| Hebdomadaire | Génération de 1-3 articles draft |
| Mensuel | Audit SEO, mise à jour des articles anciens |

**Jobs cron recommandés :**
- `surf-keyword-trends` — toutes les semaines (lun)
- `generate-article-draft` — 2x/semaine (mer, ven)
- `update-old-articles` — 1x/mois

---

### 4. Distribution automatisée

| Canal | Action |
|-------|--------|
| Google Search Console | Indexation via `site:ippriv.com` |
| Bing | Ping sitemap |
| X/Twitter | Partage automatique (avec xurl) |
| Reddit (r/networking, r/privacy) | Post si pertinent |
| LinkedIn | Article professionnel |

---

### 5. Tracking & Itération

- Google Search Console API → impressions, CTR, positions
- Identification des articles "perchos" à refresh
- A/B test des titles/meta descriptions
- Dashboard traffic (Obsidian ou Notion)

---

## Étapes d'implémentation

### Phase 1 — Fondations (J+1 à J+7)
1. **Explorateur de keywords** — script pour identifier les keywords à faible concurrence / fort volume autour d'IP privacy
2. **Template article SEO** — prompt structuré pour la génération
3. **Job cron `keyword-research`** — veille hebdo sur `whatismyip.com`, forums, Reddit, Google Trends

### Phase 2 — Génération (J+7 à J+14)
4. **Agent blog enrichi** — wrapper autour de `hermes -p blog` avec prompts SEO
5. **Intégration Unsplash** — sélection automatique d'images hero
6. **Validation frontmatter** — schema check avant commit

### Phase 3 — Distribution (J+14 à J+21)
7. **Script ping sitemap** — Bing, Google, Yandex
8. **Autopost X/Twitter** — via `xurl`, snippet de l'article
9. **Dashboard Obsidian** — tracker de performance

### Phase 4 — Optimisation continue (J+21+)
10. **Audit mensuel** — mise à jour des articles à faible perf
11. **Cross-linking engine** — lien automatique entre articles liés
12. **Refreshing content** — actualisation des stats, liens morts

---

## Outils & Accès nécessaires

| Outil | Usage | Status |
|-------|-------|--------|
| `hermes -p blog` | Rédaction/push | Disponible |
| `hermes -p ippriv` | Code/infra | Disponible |
| `xurl` (skill) | X/Twitter | À vérifier |
| `google-workspace` (skill) | Search Console | À configurer |
| Unsplash API | Images hero | À créer compte |
| Google Trends API | Keyword research | API key nécessaire |

---

## Fichiers à créer/modifier

```
/opt/ippriv-astro/
├── .hermes/
│   ├── plans/          (ce plan)
│   ├── scripts/        (scripts d'automatisation)
│   └── cron/           (config jobs)
├── scripts/
│   ├── generate-article.py
│   ├── keyword-research.py
│   ├── ping-search-engines.py
│   └── update-sitemap.js
└── src/content/blog/  (sortie : articles markdown)
```

---

## Risques & Trade-offs

| Risque | Mitigation |
|--------|------------|
| Contenu dupliqué (IA) | Review humaine + outils plagiarism |
| Quality drop | Seuils minimum (LONGTAIL, lecture > 2min) |
| Google penalty | Pas de sur-optimisation, liens naturels |
| Burnout rédac | Mix automation + création humaine |

---

## Prochaines actions (ce que je peux démarrer)

1. **Lancer un audit SEO complet** du blog existant → identifier gaps
2. **Construire le keyword research tool** → découvrir les opportunités
3. **Préparer le premier article draft** en mode automatique

---

## Questions ouvertes

- Tu veux viser le **marché EN uniquement** ou **bilingue EN/FR** ?
- Tu as déjà un accès **Google Search Console** ou **ahrefs/Semrush** ?
- Tu préfères **beaucoup de contenu rapide** (quantity) ou **moins mais très optimisé** (quality) ?
- Budget pour **Unsplash Pro** ou tierce image API ?
