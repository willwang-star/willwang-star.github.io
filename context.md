# Will's Repo — Context Handoff

A personal internal portal for Intuit teammates. Lives at https://willwang-star.github.io/

## What it is

A React app that serves as Will's repo of design work — onboarding docs, research, workshop prep — with the original HTML deliverables ported into native React routes. Visitors see a card grid of work, can search and filter by tag, and click into any item as a real sub-page (no iframes).

## Stack

- **Vite + React + TypeScript**
- **Tailwind v4 + shadcn/ui** (new-york style, dark mode locked)
- **react-router-dom v7** for client-side routing
- **pnpm** as package manager (npm hangs on the GH Actions runner)
- **GitHub Pages** as host (special bare-host URL via `<username>.github.io` repo name)
- **GitHub Actions** auto-deploys on push to `main`

## Repo

- **GitHub:** https://github.com/willwang-star/willwang-star.github.io
- **Local folder:** `/Users/wwang22/Data/Design/AI/Claude/Dev Portal`
- **Live URL:** https://willwang-star.github.io/
- **Branch:** `main` (no PR flow — direct pushes)

## Project layout

```
Dev Portal/
├── app/                            ← React app (Vite)
│   ├── public/
│   │   ├── 404.html                ← SPA redirect for direct sub-page links
│   │   ├── will-profile.png        ← avatar
│   │   └── *.html                  ← archived original HTML previews (kept for direct links)
│   ├── src/
│   │   ├── App.tsx                 ← router
│   │   ├── pages/
│   │   │   ├── home.tsx            ← card grid + search + filter pills
│   │   │   ├── preview.tsx         ← slug → component registry
│   │   │   └── previews/
│   │   │       ├── aiw-onboarding.tsx
│   │   │       ├── dde-onboarding.tsx
│   │   │       ├── dev-portal-onboarding.tsx
│   │   │       ├── user-research.tsx
│   │   │       ├── workshop-prep.tsx
│   │   │       └── pdlc-tools-research.tsx  ← exposed at /preview/prior-research
│   │   ├── components/
│   │   │   ├── ui/                 ← shadcn primitives (button, card, badge, tabs, accordion, table, …)
│   │   │   ├── layout/portal-layout.tsx
│   │   │   └── preview/            ← reusable building blocks for converted pages
│   │   │       ├── preview-shell.tsx     ← 1-line back banner + dark-only + doc title
│   │   │       ├── section.tsx
│   │   │       ├── stat-card.tsx
│   │   │       ├── quote.tsx
│   │   │       ├── callout.tsx
│   │   │       └── labeled-list.tsx
│   │   ├── lib/
│   │   │   ├── previews.ts         ← single source of truth for the card/route list
│   │   │   ├── profile.ts          ← name, role, Slack URL, avatar file
│   │   │   ├── chat-api.ts         ← stub for future AI chat backend
│   │   │   └── utils.ts            ← cn() helper
│   │   └── index.css               ← shadcn theme tokens (dark default)
│   ├── vite.config.ts              ← base = '/'
│   └── components.json             ← shadcn config
├── worker/                         ← Cloudflare Worker scaffold for future AI chat (parked)
├── Research/
│   └── genos-backlog.md            ← un-park playbook for the AI chat (Intuit GenOS access)
├── .github/workflows/deploy.yml    ← pnpm install + build + deploy to Pages
└── README.md
```

## Home page

- Title: **Will's Repo**, with a 56×56 circle avatar to the left
- **Slack me** button (top-right) deep-links to Will's profile in the Intuit workspace
- Search input + filter pills derived from preview tags
- 2-column card grid at every viewport (mobile too)
- Each card has a 2-line title: small "platform" line + larger content-type line
- Filter pills: AI Workbench, DDE, Dev Portal, Onboarding, Research, Workshop

## Preview pages (6 total)

Each one is a real React route at `/<slug>`:

| Slug | Card title | Source HTML |
|---|---|---|
| `ai-workbench-onboarding` | AI Workbench / Onboarding | AIW Onboarding.html |
| `data-discovery-onboarding` | DDE / Onboarding | DDE Onboarding.html |
| `dev-portal-onboarding` | Dev Portal / Onboarding | Dev Portal Onboarding.html |
| `user-research` | Dev Portal / User Research | DevPortal User Research.html |
| `workshop-prep` | Dev Portal / Workshop Prep | DevPortal Workshop Brief.html |
| `prior-research` | Dev Portal / Prior Research | DevPortal PDLC Tools Research.html |

Each page wears the same shell:
- 1-line sticky top banner: `← Will's Repo · Platform · Title`
- Page-level `<Tabs>` (sticky/pinned while scrolling for easy nav)
- shadcn primitives only — no emojis, no custom CSS
- Dark mode only (theme toggle removed sitewide)
- 1000px content max-width, mobile-responsive

The original HTML files still live in `app/public/` so direct links to them keep working, but the cards on Home now link to the React routes.

## Conventions / preferences (memorized)

- **Default UI library is shadcn/ui** — never mix in MUI / Chakra / etc.
- **Hit a problem → find a workaround**, no questions asked. Don't pause for routine confirmations.
- **Test twice before handoff** — local build + verify the live deployed URL before reporting done.
- **Deliverable = a public URL the user clicks**, not localhost or a branch.
- **User reviews only** — drive scaffold → build → push → deploy → verify end-to-end.
- **Working files go in `Research/`** — keep the parent folder clean for resources.
- **Dev workflow:** `cd app && pnpm install && pnpm dev` — opens at http://localhost:5173/

## Parked work (out of current scope)

- **AI chat with Will's digital twin** (`/chat` route + `worker/`). Pipeline ready: shadcn UI, Cloudflare Worker scaffold that fetches `digital-twin.md` from https://github.com/wangyuewwl/Digital-Twin and uses it as the system prompt. Currently returns a placeholder. Un-park requires Intuit GenOS / GenStudio access. Full plan in `Research/genos-backlog.md`.

## Recent rename

The repo was originally `devportal-previews`, then `devportal`, now `willwang-star.github.io`. This last rename moves the site from `https://willwang-star.github.io/devportal/` to the bare host. Vite base is `/`, 404.html basePath is `/`. Old URLs return 404.

## How to extend

**Add a new preview:**
1. Create `app/src/pages/previews/<slug>.tsx` using `PreviewShell` + the preview building blocks.
2. Add an entry to `app/src/lib/previews.ts` (slug, platform, title, file, tags).
3. Wire into the registry in `app/src/pages/preview.tsx`.
4. `git push` — CI deploys in ~1–2 min.

**Update the home title row, avatar, or Slack CTA:** edit `app/src/lib/profile.ts`.

**Update tag/filter labels:** edit `tags` arrays in `app/src/lib/previews.ts`.
