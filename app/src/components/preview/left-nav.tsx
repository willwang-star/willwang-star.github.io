import { cn } from "@/lib/utils"
import { scrollToHeading, type TocHeading } from "./use-headings-spy"

interface LeftNavProps {
  headings: TocHeading[]
  activeId: string | null
}

const TEXT_PAD = {
  2: 14, // px text padding for top-level items
  3: 26, // px text padding for nested items
} as const

/**
 * Sticky left-side table of contents.
 * Desktop only — hidden below lg.
 *
 * One straight vertical rail at the left edge of the list. Indentation
 * for nested items is text-only (just more padding). Active item changes
 * color (foreground) and the rail segment beside it brightens — no
 * font-weight change.
 */
export function LeftNav({ headings, activeId }: LeftNavProps) {
  if (headings.length === 0) return null

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="On this page"
        className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        <ul className="relative">
          {/* Faint full-height rail. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-foreground/15"
          />
          {headings.map((heading) => {
            const isActive = heading.id === activeId
            const isNested = heading.level >= 3
            return (
              <li key={heading.id} className="relative">
                {/* Active rail segment. */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-px bg-foreground transition-colors"
                  />
                )}
                <button
                  type="button"
                  onClick={() => scrollToHeading(heading.id)}
                  style={{
                    paddingInlineStart: isNested
                      ? TEXT_PAD[3]
                      : TEXT_PAD[2],
                  }}
                  className={cn(
                    "block w-full py-1.5 pr-2 text-left text-sm leading-snug transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {heading.text}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
