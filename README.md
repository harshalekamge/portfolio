# Harsha Lekamge — Portfolio

Personal portfolio of Harsha Lekamge, live at **https://portfolio.harshalekamge.com**.

Built with Next.js (App Router), GSAP, Lenis and Matter.js. Deploys to Vercel.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Edit the content

Everything the site says lives in **`content/site.ts`**: name, SEO text, roles, projects,
experience, skills, links and the pills that fall into the footer. Change it there and
the page, the structured data (JSON-LD), the sitemap and the social preview image all follow.

Project screenshots go in `public/images/work/`. The portrait is `public/images/harsha-lekamge.webp`.

## Contact form (Supabase)

Messages are saved to the `contact_submissions` table (`name`, `email`, `phone`, `message`).
Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Without these keys the form still works: it opens the visitor's email app instead.

## Deploy on Vercel

1. Import the repo on vercel.com (framework is detected as Next.js; no settings needed).
2. Add the two Supabase variables above under **Settings → Environment Variables**.
3. Add the domain `portfolio.harshalekamge.com` under **Settings → Domains** and point the DNS
   record your registrar shows (a `CNAME` to `cname.vercel-dns.com`).

## What's in here

| Path | What it does |
| --- | --- |
| `app/layout.tsx` | Fonts, metadata, JSON-LD, intro loader, cursor, smooth scroll |
| `app/page.tsx` | The page, section by section |
| `app/opengraph-image.tsx` | Generates the 1200×630 social preview |
| `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` | SEO files |
| `app/api/contact/route.ts` | Saves contact messages to Supabase |
| `components/` | One component per section, plus the motion pieces |
| `lib/motion.ts` | GSAP setup, the house easing, a tiny spring |

Motion respects the visitor's "reduce motion" setting, and there's a Motion switch in the header.
