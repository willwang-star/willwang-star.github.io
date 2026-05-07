export type Preview = {
  slug: string
  /** Platform / context — small first line on the card. */
  platform: string
  /** Type of content — bigger second line on the card. */
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
    platform: "AI Workbench",
    title: "Onboarding",
    file: "AIW Onboarding.html",
    tags: ["AI Workbench", "Onboarding"],
  },
  {
    slug: "data-discovery-onboarding",
    platform: "DDE",
    title: "Onboarding",
    file: "DDE Onboarding.html",
    tags: ["DDE", "Onboarding"],
  },
  {
    slug: "dev-portal-onboarding",
    platform: "Dev Portal",
    title: "Onboarding",
    file: "Dev Portal Onboarding.html",
    tags: ["Dev Portal", "Onboarding"],
  },
  {
    slug: "user-research",
    platform: "Dev Portal",
    title: "User Research",
    file: "DevPortal User Research.html",
    tags: ["Dev Portal", "Research"],
  },
  {
    slug: "workshop-prep",
    platform: "Dev Portal",
    title: "Workshop Prep",
    file: "DevPortal Workshop Brief.html",
    tags: ["Dev Portal", "Workshop"],
  },
  {
    slug: "prior-research",
    platform: "Dev Portal",
    title: "Prior Research",
    file: "DevPortal PDLC Tools Research.html",
    tags: ["Dev Portal", "Research"],
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
