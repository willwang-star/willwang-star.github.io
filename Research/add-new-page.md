# Push a new preview page to willwang-star.github.io

I'm working in this repo. Help me add a new preview page end-to-end:
scaffold the React file, register it, build it locally, push to GitHub,
wait for the GitHub Pages deploy, and verify the live URL.

## Repo facts (assume these are correct, don't change them)

- **Repo:** https://github.com/willwang-star/willwang-star.github.io
- **Live URL:** https://willwang-star.github.io/
- **Local folder:** `/Users/wwang22/Data/Design/AI/Claude/Dev Portal`
- **App lives in `app/`** — Vite + React + TypeScript + Tailwind v4 + shadcn/ui
- **Package manager: pnpm** (NOT npm — npm hangs on CI)
- **Node version: 22 LTS** — load with `source ~/.nvm/nvm.sh && nvm use --lts=jod`
- **Dev server:** `cd app && pnpm dev` → http://localhost:5173/
- **Dark mode only.** All visual work uses shadcn/ui + Tailwind tokens; no emojis.

## Architecture conventions

Every preview page is a React route at `/<slug>` rendered inside `PreviewShell`,
which provides a sticky back-banner and a left-rail TOC that auto-scans H2/H3.

### Folder layout

```
app/src/
├── pages/
│   ├── home.tsx                    ← card grid
│   ├── preview.tsx                 ← slug → component registry
│   └── previews/
│       └── <new-slug>.tsx          ← THE FILE YOU CREATE
├── components/
│   ├── ui/                         ← shadcn primitives (don't modify)
│   └── preview/                    ← shared building blocks (use these)
│       ├── preview-shell.tsx       ← page wrapper (banner + TOC + layout)
│       ├── section.tsx             ← exports PageHeader, Category, Section
│       ├── stat-card.tsx           ← StatCard, StatGrid
│       ├── quote.tsx               ← Quote
│       ├── callout.tsx             ← Callout (tones: default | warning | critical | positive)
│       ├── labeled-list.tsx        ← LabeledList
│       ├── left-nav.tsx            ← TOC rail (auto, do not touch)
│       ├── mobile-toc.tsx          ← mobile TOC sheet (auto)
│       └── use-headings-spy.ts     ← scroll-spy hook (auto)
└── lib/
    └── previews.ts                 ← register the new page here
```

### Page anatomy

Every preview page follows this shape:

```tsx
import { PreviewShell } from "@/components/preview/preview-shell"
import { Category, PageHeader, Section } from "@/components/preview/section"
// import other building blocks as needed: Callout, Quote, StatCard, StatGrid, LabeledList

export function MyPage() {
  return (
    <PreviewShell platform="<platform name>" title="<page title>">
      <div className="space-y-12">
        <PageHeader
          title="The main H1 (no eyebrow)"
          subtitle="One-sentence summary. Optional."
        />

        <Category title="First top-level group (H2 — shows in TOC)">
          <Section title="Sub-section (H3 — indented in TOC)">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Body copy goes here.
            </p>
          </Section>

          <Section title="Another sub-section">
            {/* use shadcn Card, Badge, etc. as needed */}
          </Section>
        </Category>

        <Category title="Second top-level group">
          <Section title="Sub-section">…</Section>
        </Category>
      </div>
    </PreviewShell>
  )
}
```

### Component cheatsheet

- `<PageHeader title subtitle?>` — H1. Drop the eyebrow prop, we removed it.
- `<Category title eyebrow? description?>` — H2 group (shows up as top-level
  TOC entry). Use this whenever you want a major section. Has a top border.
- `<Section title? eyebrow? description?>` — H3 sub-section (indented TOC entry).
  Use this for sub-sections inside a Category. Title is optional — omit it for
  a content-only wrapper that doesn't add a TOC entry.
- `<StatGrid cols={2|3|4}>` + `<StatCard value label />` — number cards.
- `<Callout tone="warning|critical|positive|default" title?>` — colored side-bar callout.
- `<Quote attribution?>` — italic quote in a card with a foreground/30 left bar.
- `<LabeledList cols={1|2|3} items={[{label, description, detail?}]} />` — grid of cards.

Use shadcn primitives directly when none of the above fits:
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `Badge` (variant: default | secondary | outline | destructive)
- `Button` (variant: default | secondary | outline | ghost | link)
- `Input`
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- `Alert`, `AlertTitle`, `AlertDescription`
- `Avatar`, `AvatarImage`, `AvatarFallback`
- `Separator`, `ScrollArea`, `Tooltip`, `Sheet`, `Skeleton`

Use Tailwind tokens, not hex values: `text-foreground`, `text-muted-foreground`,
`bg-background`, `bg-card`, `bg-accent`, `border-border`, `bg-foreground/15` etc.

To **skip** a heading from the TOC, add `data-toc-skip` to it:

```tsx
<h4 data-toc-skip className="text-lg font-medium">Won't appear in TOC</h4>
```

## Steps to follow

1. **Ask me the inputs:**
   - The page slug (kebab-case, e.g. `team-charter`). Will be the URL: `https://willwang-star.github.io/<slug>`
   - The platform label (top line on the card, e.g. `Dev Portal`)
   - The page title (bottom line on the card)
   - The card tags (e.g. `["Dev Portal", "Process"]`) — these drive the home filter pills
   - Content. If I just describe the topic, draft a sensible structure (Categories + Sections) and ask for review.

2. **Create `app/src/pages/previews/<slug>.tsx`** following the template above.

3. **Register it in `app/src/lib/previews.ts`** — add a new entry:

   ```ts
   {
     slug: "<slug>",
     platform: "<platform>",
     title: "<title>",
     file: "",  // empty unless there's a source HTML
     tags: [...],
   },
   ```

4. **Wire it into the router in `app/src/pages/preview.tsx`** — import the new
   component and add it to the `previewComponents` map keyed by the slug.

5. **Build locally first** to catch TS errors:

   ```bash
   source ~/.nvm/nvm.sh && nvm use --lts=jod >/dev/null
   cd "/Users/wwang22/Data/Design/AI/Claude/Dev Portal/app"
   npx pnpm@9 build
   ```

   Fix any errors before proceeding.

6. **Commit and push:**

   ```bash
   cd "/Users/wwang22/Data/Design/AI/Claude/Dev Portal"
   git add -A
   git commit -m "Add <slug> preview page"
   git push
   ```

7. **Wait for the GitHub Pages deploy:**

   ```bash
   sleep 5
   RID=$(gh run list -R willwang-star/willwang-star.github.io --workflow=deploy.yml --limit 1 --json databaseId -q '.[0].databaseId')
   until [ "$(gh run view $RID -R willwang-star/willwang-star.github.io --json status -q .status)" = "completed" ]; do sleep 15; done
   gh run view $RID -R willwang-star/willwang-star.github.io --json conclusion -q .conclusion
   ```

   Should print `success`.

8. **Verify the live URL** — fetch it and compare the build hash to the local one:

   ```bash
   curl -s https://willwang-star.github.io/ | grep -oE 'index-[a-zA-Z0-9_-]+\.js'
   ```

9. **Report back** with the live URL: `https://willwang-star.github.io/<slug>`

## Working preferences

- Auto mode: execute end-to-end, don't pause for routine confirmations.
- If you hit a build error, fix it autonomously — don't ask.
- Test twice before saying done: local build green AND live URL serves the new bundle.
- Don't push if `pnpm build` failed.
- Don't ever introduce another UI library; shadcn is the only one.

Now: ask me what page I want to add.
