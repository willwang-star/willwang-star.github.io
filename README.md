# Dev Portal

Personal internal portal hosted via GitHub Pages, fronted by a React index page (Vite + shadcn/ui).

- **Repo:** https://github.com/willwang-star/devportal
- **Live site:** https://willwang-star.github.io/devportal/
- **Local folder:** `/Users/wwang22/Data/Design/AI/Claude/Dev Portal`

## Project layout

```
Dev Portal/
├── app/                          ← React index app (Vite + Tailwind + shadcn/ui)
│   ├── public/                   ← static HTML previews live here
│   │   ├── AIW Onboarding.html
│   │   ├── DDE Onboarding.html
│   │   └── ...
│   └── src/                      ← React source for the index page
│       ├── App.tsx
│       └── lib/previews.ts       ← list of previews + tags
└── .github/workflows/deploy.yml  ← builds + deploys to Pages on push to main
```

## Workflow

### Add a new HTML preview

1. Drop the new `.html` file into `app/public/`.
2. Add an entry to `app/src/lib/previews.ts` with the title, file name, and tags.
3. Commit and push:

   ```bash
   git add .
   git commit -m "describe the change"
   git push
   ```

4. GitHub Actions builds the app and redeploys Pages in ~1–2 minutes.

### Update an existing preview

Edit the file in `app/public/` (filename stays the same so the URL is stable). Push.

### Run the dev server locally

```bash
cd app
npm install   # first time only
npm run dev
```

Open http://localhost:5173/devportal/

### URL pattern

Filenames are preserved as-is. Spaces become `%20` in the URL:

```
https://willwang-star.github.io/devportal/<File Name>.html
```

## Notes

- `.DS_Store`, `SESSION_CONTEXT.md`, `node_modules`, and `dist` are gitignored.
- Repo is public (required for free GitHub Pages).
- Auth is handled by `gh auth` on this machine — no extra setup needed for pushes.
- GitHub Pages must be set to **Source: GitHub Actions** in repo Settings → Pages.
