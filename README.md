# Harsha Lekamge — Portfolio Website

My personal portfolio website: who I am, the projects I've built, the tools and languages I use, and a contact form that lets visitors reach me directly.

- **Live site:** https://portfolio.harshalekamge.com
- **Author:** Harsha Lekamge — Founder & CEO of One Billion Labs, co-founder of Quintolink

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Branches](#branches)
4. [Project structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Run locally](#run-locally)
7. [Environment variables](#environment-variables)
8. [Supabase setup (contact form)](#supabase-setup-contact-form)
9. [Available scripts](#available-scripts)
10. [Editing content](#editing-content)
11. [Build and deploy (Firebase Hosting)](#build-and-deploy-firebase-hosting)
12. [Troubleshooting](#troubleshooting)

---

## Features

- **Loading screen** shown for two seconds while the site boots
- **Navbar** with smooth scrolling to each section
- **Hero** introduction
- **About** section
- **Projects** gallery — including the Sales Shoe Mart mobile app UI, the Saloon Ceylonima website and the Saloon Velora website
- **Skills** grouped by category with proficiency levels (Python, Supabase, Cursor, Google AI Studio, On-Page SEO, Replit and more)
- **Contact form** (name, email, phone, message). Submissions are saved to Supabase; the visitor must give either an email or a phone number
- Animations with Framer Motion, icons from React Icons
- SEO files: `robots.txt`, `sitemap.xml`, `site.webmanifest`
- Runs locally **without** Supabase keys — the contact form is simply disabled and a warning is logged

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19 (Create React App / `react-scripts` 5) |
| Animation | Framer Motion 12 |
| Icons | React Icons 5 |
| Database | Supabase (`contact_submissions` table) via `@supabase/supabase-js` |
| Hosting | Firebase Hosting (project `harshaportfolio-f89c6`) |
| CI | GitHub Actions — Firebase preview deploy on every pull request |

`axios`, `react-router-dom` and `@emailjs/browser` are installed for future features but not used by the current pages.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Current live site (React + Firebase) — this README |
| `redesign-2026` | New version being built in Next.js for Vercel, reusing this content plus an Experience section and keeping Supabase |

## Project structure

```
portfolio/
├── portfolio-frontend/          # The React app (everything that runs)
│   ├── public/                  # index.html, favicons, robots.txt, sitemap.xml, manifest
│   ├── src/
│   │   ├── App.js               # Loading screen + page sections in order
│   │   ├── supabaseClient.js    # Creates the Supabase client from env variables
│   │   └── components/
│   │       ├── Navbar.js / .css
│   │       ├── Hero.js / .css
│   │       ├── About.js / .css
│   │       ├── Projects.js / .css   # Project list (edit here to add projects)
│   │       ├── Skills.js / .css     # Skills list (edit here to add skills)
│   │       ├── Contact.js / .css    # Contact form -> Supabase
│   │       └── Footer.js / .css
│   ├── .env.example             # Template for the env file
│   └── package.json
├── portfolio-backend/           # Placeholder for a future API (not used yet)
├── firebase.json                # Hosting config: serves portfolio-frontend/build, SPA rewrites
└── .github/workflows/           # Firebase preview deploy on pull requests
```

## Prerequisites

| Tool | Version | Check |
|---|---|---|
| [Node.js](https://nodejs.org) | 18 or newer (20 LTS recommended) | `node -v` |
| npm | comes with Node.js | `npm -v` |
| Git | any recent version | `git --version` |
| Firebase CLI | only needed to deploy | `firebase --version` |
| Supabase project | only needed for the contact form | — |

## Run locally

```bash
# 1. Clone the repository
git clone https://github.com/harshalekamge/portfolio.git
cd portfolio/portfolio-frontend

# 2. Install dependencies
npm install

# 3. (Optional) create the env file for the contact form
cp .env.example .env
#   then open .env and paste your Supabase URL and anon key

# 4. Start the development server
npm start
```

The site opens at **http://localhost:3000** and reloads when you save a file.

On Windows (Command Prompt) use `copy .env.example .env` instead of `cp`.

## Environment variables

Create `portfolio-frontend/.env` (ignored by Git):

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_SUPABASE_URL` | For the contact form | Supabase project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | For the contact form | Supabase publishable / anon key |

Create React App only reads variables that start with `REACT_APP_`, and only when `npm start` or `npm run build` starts — restart after editing `.env`.

## Supabase setup (contact form)

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run:

```sql
create table if not exists public.contact_submissions (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now(),
  name        text not null,
  email       text,
  phone       text,
  message     text not null
);

alter table public.contact_submissions enable row level security;

-- Visitors may only add messages, never read them
create policy "Anyone can send a message"
  on public.contact_submissions for insert to anon with check (true);
```

3. Copy the **Project URL** and **anon key** from **Project Settings → API** into `.env`.
4. Read messages in **Table Editor → contact_submissions**.

## Available scripts

Run inside `portfolio-frontend/`:

| Command | What it does |
|---|---|
| `npm start` | Development server on http://localhost:3000 |
| `npm run build` | Production build in `portfolio-frontend/build/` |
| `npm test` | Runs tests in watch mode |
| `npm run eject` | Ejects from Create React App (one-way; not recommended) |

## Editing content

| What | Where |
|---|---|
| Name, intro, headline | `src/components/Hero.js` |
| About text | `src/components/About.js` |
| Projects (title, description, image, links) | the `projects` array in `src/components/Projects.js` |
| Skills and levels | the skill groups in `src/components/Skills.js` |
| Contact fields / messages | `src/components/Contact.js` |
| Page title, meta tags | `public/index.html` |
| Sitemap | `public/sitemap.xml` |

## Build and deploy (Firebase Hosting)

`firebase.json` serves `portfolio-frontend/build` and rewrites every route to `index.html`.

```bash
# one-time setup
npm install -g firebase-tools
firebase login

# build and deploy (from the repository root)
cd portfolio-frontend && npm run build && cd ..
firebase deploy --only hosting
```

For the production build, put the Supabase variables in `portfolio-frontend/.env` before running `npm run build` — they are baked into the bundle at build time.

**Pull-request previews:** `.github/workflows/firebase-hosting-pull-request.yml` builds the site and posts a Firebase preview link on every pull request. It needs the `FIREBASE_SERVICE_ACCOUNT_HARSHAPORTFOLIO_F89C6` repository secret. The workflow runs `npm run build` from the repository root; if it fails, change that step to `npm ci && npm run build` with `working-directory: portfolio-frontend`.

## Troubleshooting

| Problem | Fix |
|---|---|
| Console shows `Supabase keys missing - contact form is disabled.` | Expected without `.env`. Add the two variables and restart `npm start` |
| Contact form says "Something went wrong" | Check the `contact_submissions` table exists and has the anon insert policy |
| `Something is already running on port 3000` | Press `Y` to use another port, or stop the other app |
| Blank page after deploy | Make sure you ran `npm run build` before `firebase deploy` |
| `npm install` errors | Use Node.js 18+; delete `node_modules` and `package-lock.json`, then reinstall |

---

© Harsha Lekamge. All rights reserved.
