# portfolio-frontend

The React app behind https://portfolio.harshalekamge.com. Full documentation (features, Supabase setup, deployment) is in the [main README](../README.md).

## Quick start

```bash
npm install
cp .env.example .env     # optional: add Supabase keys to enable the contact form
npm start                # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Development server with hot reload on http://localhost:3000 |
| `npm run build` | Production build in `build/` (served by Firebase Hosting) |
| `npm test` | Test runner in watch mode |

## Environment variables (`.env`)

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Without them the site still runs; only the contact form is disabled.

## Where things live

| File | Purpose |
|---|---|
| `src/App.js` | Loading screen and section order |
| `src/supabaseClient.js` | Supabase client (null when keys are missing) |
| `src/components/*` | Navbar, Hero, About, Projects, Skills, Contact, Footer — each with its own CSS file |
| `public/` | `index.html`, favicons, `robots.txt`, `sitemap.xml`, `site.webmanifest` |
