import { Link } from "react-router-dom"
import { useState } from "react"
import {
  ArrowLeft,
  Bell,
  Compass,
  Home,
  LayoutGrid,
  LifeBuoy,
  Search,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

/* ──────────────────────────────────────────────────────────────────────────
   Nav Concept — Dev Portal

   A starter sandbox for exploring a new navigation pattern for the Dev
   Portal. The left rail uses a compact, icon-first layout with optional
   labels; the right side is a stand-in canvas where each nav item swaps
   the displayed section.

   Drop new sections in `NAV_ITEMS` and add their content to
   `sectionContent` below to iterate quickly.
   ────────────────────────────────────────────────────────────────────── */

type NavId =
  | "home"
  | "explore"
  | "spaces"
  | "ai"
  | "alerts"
  | "support"
  | "settings"

type NavItem = {
  id: NavId
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "spaces", label: "Spaces", icon: LayoutGrid },
  { id: "ai", label: "AI", icon: Sparkles },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "support", label: "Support", icon: LifeBuoy },
  { id: "settings", label: "Settings", icon: Settings },
]

export function NavConceptPage() {
  const [active, setActive] = useState<NavId>("home")
  const activeItem = NAV_ITEMS.find((n) => n.id === active) ?? NAV_ITEMS[0]

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Top utility bar — keeps a way back to the portal index. */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to portal
        </Link>
        <div className="text-xs uppercase tracking-wide text-neutral-500">
          Nav Concept · Dev Portal
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-49px)]">
        {/* Left nav rail */}
        <aside
          className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white"
          aria-label="Primary"
        >
          <div className="px-4 py-4">
            <div className="flex items-center gap-2">
              <div
                className="grid size-7 place-items-center rounded-md bg-neutral-900 text-[11px] font-semibold text-white"
                aria-hidden="true"
              >
                DP
              </div>
              <span className="text-sm font-semibold">Dev Portal</span>
            </div>
          </div>

          <div className="px-3">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search"
                className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-2 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
              />
            </label>
          </div>

          <nav className="mt-4 flex-1 px-2" aria-label="Sections">
            <ul className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = item.id === active
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActive(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-100",
                      ].join(" ")}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500">
            v0 · concept
          </div>
        </aside>

        {/* Main canvas */}
        <main className="flex-1 p-8">
          <header className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {activeItem.label}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {sectionContent[active].heading}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600">
              {sectionContent[active].blurb}
            </p>
          </header>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectionContent[active].cards.map((card) => (
              <article
                key={card.title}
                className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold">{card.title}</h2>
                <p className="mt-1 text-sm text-neutral-600">{card.body}</p>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}

type SectionContent = {
  heading: string
  blurb: string
  cards: { title: string; body: string }[]
}

const sectionContent: Record<NavId, SectionContent> = {
  home: {
    heading: "Welcome back",
    blurb:
      "Quick access to your most-used Dev Portal surfaces and the things you were last working on.",
    cards: [
      { title: "Recent docs", body: "Pick up where you left off." },
      { title: "Pinned spaces", body: "Your team's most-visited spaces." },
      { title: "Today's standup", body: "Drafts, blockers, and updates." },
    ],
  },
  explore: {
    heading: "Explore",
    blurb: "Browse everything across the portal — surfaces, tools, and docs.",
    cards: [
      { title: "All surfaces", body: "Every product surface in one place." },
      { title: "Tools index", body: "PDLC tools, indexed and filterable." },
      { title: "What's new", body: "Recently shipped or updated." },
    ],
  },
  spaces: {
    heading: "Spaces",
    blurb: "Team workspaces with shared docs, dashboards, and decisions.",
    cards: [
      { title: "Dev Portal core", body: "Roadmap, design, and research." },
      { title: "AI Workbench", body: "Models, prompts, evals, and runs." },
      { title: "Data Discovery", body: "Datasets, lineage, and ownership." },
    ],
  },
  ai: {
    heading: "AI",
    blurb: "AI-powered helpers tuned for the Dev Portal context.",
    cards: [
      { title: "Ask the portal", body: "Conversational search across all docs." },
      { title: "Summarize selection", body: "Quick TL;DRs for long pages." },
      { title: "Action drafts", body: "Pre-filled tickets, posts, and notes." },
    ],
  },
  alerts: {
    heading: "Alerts",
    blurb: "Things that need your attention, ranked by urgency.",
    cards: [
      { title: "Mentions", body: "Threads and docs that tagged you." },
      { title: "Review requests", body: "PRs and docs waiting on your sign-off." },
      { title: "System status", body: "Incidents and degradations." },
    ],
  },
  support: {
    heading: "Support",
    blurb: "Help articles, contacts, and ways to get unstuck fast.",
    cards: [
      { title: "Knowledge base", body: "How-tos and troubleshooting." },
      { title: "Office hours", body: "Drop-in slots with the team." },
      { title: "File a ticket", body: "Routes to the right on-call." },
    ],
  },
  settings: {
    heading: "Settings",
    blurb: "Preferences for the Dev Portal — yours, not your team's.",
    cards: [
      { title: "Appearance", body: "Theme, density, and motion." },
      { title: "Notifications", body: "Channels, quiet hours, and digests." },
      { title: "Integrations", body: "Slack, Jira, GitHub, and more." },
    ],
  },
}
