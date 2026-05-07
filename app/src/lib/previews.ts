export type Preview = {
  title: string
  file: string
  description?: string
  tags: string[]
}

// File names match the actual files in app/public/ exactly (including spaces).
// Tags drive the filter pills.
export const previews: Preview[] = [
  {
    title: "AI Workbench Onboarding",
    file: "AIW Onboarding.html",
    tags: ["Onboarding", "AIW"],
  },
  {
    title: "Data Discovery & Exploration Onboarding",
    file: "DDE Onboarding.html",
    tags: ["Onboarding", "DDE"],
  },
  {
    title: "Dev Portal Onboarding",
    file: "Dev Portal Onboarding.html",
    tags: ["Onboarding", "Dev Portal"],
  },
  {
    title: "User Research",
    file: "DevPortal User Research.html",
    tags: ["Research", "Dev Portal"],
  },
  {
    title: "Workshop Prep",
    file: "DevPortal Workshop Brief.html",
    tags: ["Workshop", "Dev Portal"],
  },
  {
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
