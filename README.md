# Will's Repo

Personal internal portal hosted via GitHub Pages, fronted by a React index page (Vite + shadcn/ui).

- **Repo:** https://github.com/willwang-star/willwang-star.github.io
- **Live site:** https://willwang-star.github.io/
- **Local folder:** `/Users/wwang22/Data/Design/AI/Claude/Dev Portal`

## Project layout

```
Dev Portal/
├── app/                          ← React app (Vite + Tailwind + shadcn/ui)
│   ├── public/                   ← static HTML previews + 404.html SPA redirect
│   └── src/
│       ├── pages/                ← Home + per-preview React routes
│       └── lib/previews.ts       ← list of previews + tags + slugs
└── .github/workflows/deploy.yml  ← builds + deploys to Pages on push to main
```

## Workflow

### Add a new preview

1. Build the React page in `app/src/pages/previews/<slug>.tsx`.
2. Register it in `app/src/lib/previews.ts` (slug, platform, title, tags).
3. Wire it into the router in `app/src/pages/preview.tsx`.
4. Commit and push:

   ```bash
   git add .
   git commit -m "describe the change"
   git push
   ```

5. GitHub Actions builds the app and redeploys Pages in ~1–2 minutes.

### Run the dev server locally

```bash
cd app
pnpm install   # first time only
pnpm dev
```

Open http://localhost:5173/

### URL pattern

```
https://willwang-star.github.io/preview/<slug>
```

## Notes

- `.DS_Store`, `SESSION_CONTEXT.md`, `node_modules`, and `dist` are gitignored.
- Repo is public (required for free GitHub Pages).
- Auth is handled by `gh auth` on this machine — no extra setup needed for pushes.
- GitHub Pages must be set to **Source: GitHub Actions** in repo Settings → Pages.
- Repo name `willwang-star.github.io` is special — GitHub serves it at the bare-host URL `https://willwang-star.github.io/` (no project subpath).
