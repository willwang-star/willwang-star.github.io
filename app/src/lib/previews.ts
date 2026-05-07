export type Preview = {
  slug: string
  title: string
  file: string
  description?: string
  tags: string[]
}

// File names match the actual files in app/public/ exactly (including spaces).
// Slugs are the URL path under /preview/ — keep them stable, kebab-case, no spaces.
export const previews: Preview[] = [
  {
    slug: "ai-workbench-onboarding",
    title: "AI Workbench Onboarding",
    file: "AIW Onboarding.html",
    tags: ["Onboarding", "AIW"],
  },
  {
    slug: "data-discovery-onboarding",
    title: "Data Discovery & Exploration Onboarding",
    file: "DDE Onboarding.html",
    tags: ["Onboarding", "DDE"],
  },
  {
    slug: "dev-portal-onboarding",
    title: "Dev Portal Onboarding",
    file: "Dev Portal Onboarding.html",
    tags: ["Onboarding", "Dev Portal"],
  },
  {
    slug: "user-research",
    title: "User Research",
    file: "DevPortal User Research.html",
    tags: ["Research", "Dev Portal"],
  },
  {
    slug: "workshop-prep",
    title: "Workshop Prep",
    file: "DevPortal Workshop Brief.html",
    tags: ["Workshop", "Dev Portal"],
  },
  {
    slug: "pdlc-tools-research",
    title: "PDLC Tools Research",
    file: "DevPortal PDLC Tools Research.html",
    tags: ["Research", "Dev Portal", "PDLC"],
  },
]

export function allTags(items: Preview[]): string[] {
  const set = new Set<string>()
  for (const item of items) for (const tag of item.tags) set.add(tag)
  return Array.from(set).sort()
}

export function findPreviewBySlug(slug: string): Preview | undefined {
  return previews.find((p) => p.slug === slug)
}
