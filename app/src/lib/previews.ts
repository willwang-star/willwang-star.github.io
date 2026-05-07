export type Preview = {
  title: string
  file: string
  description?: string
  tags: string[]
}

// File names match the actual files in app/public/.
// Tags are placeholders — update once the user provides the real tag schema.
export const previews: Preview[] = [
  {
    title: "AIW Onboarding",
    file: "AIW Onboarding.html",
    tags: ["Onboarding", "AIW"],
  },
  {
    title: "DDE Onboarding",
    file: "DDE Onboarding.html",
    tags: ["Onboarding", "DDE"],
  },
  {
    title: "Dev Portal Onboarding",
    file: "Dev Portal Onboarding.html",
    tags: ["Onboarding", "Dev Portal"],
  },
  {
    title: "DevPortal User Research",
    file: "DevPortal User Research.html",
    tags: ["Research", "Dev Portal"],
  },
  {
    title: "DevPortal Workshop Brief",
    file: "DevPortal Workshop Brief.html",
    tags: ["Workshop", "Dev Portal"],
  },
  {
    title: "DevPortal PDLC Tools Research",
    file: "DevPortal PDLC Tools Research.html",
    description: "PDLC × ownership-tier mapping of every tool in the dev environment, synthesized from Horizons UX FigJam + AI-Native Dev Environment strategy.",
    tags: ["Research", "Dev Portal", "PDLC"],
  },
]

export function allTags(items: Preview[]): string[] {
  const set = new Set<string>()
  for (const item of items) for (const tag of item.tags) set.add(tag)
  return Array.from(set).sort()
}
