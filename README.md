# Dev Portal Previews

HTML previews hosted via GitHub Pages.

- **Repo:** https://github.com/willwang-star/devportal-previews
- **Live site:** https://willwang-star.github.io/devportal-previews/
- **Local folder:** `/Users/wwang22/Data/Design/AI/Claude/Dev Portal`

## Workflow

### Add or update an HTML file

1. Drop the new/updated `.html` file into this folder.
2. If it's a new file, add a link to it in `index.html` (under the `<ul>` list). Use `%20` in place of spaces in the `href`.
3. Commit and push:

   ```bash
   cd "/Users/wwang22/Data/Design/AI/Claude/Dev Portal"
   git add .
   git commit -m "describe the change"
   git push
   ```

4. Pages redeploys automatically in ~1 minute.

### URL pattern

Filenames are preserved as-is. Spaces become `%20` in the URL:

```
https://willwang-star.github.io/devportal-previews/<File Name>.html
```

## Notes

- `.DS_Store` and `SESSION_CONTEXT.md` are gitignored.
- Repo is public (required for free GitHub Pages).
- Auth is handled by `gh auth` on this machine — no extra setup needed for pushes.
