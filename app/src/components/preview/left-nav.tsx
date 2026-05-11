import { cn } from "@/lib/utils"
import { scrollToHeading, type TocHeading } from "./use-headings-spy"

interface LeftNavProps {
  headings: TocHeading[]
  activeId: string | null
}

/**
 * Sticky left-side table of contents.
 * Desktop only — hidden below lg.
 * Borderless typography rail with a 2px accent line on the right edge,
 * sliding to mark the active heading.
 */
export function LeftNav({ headings, activeId }: LeftNavProps) {
  if (headings.length === 0) return null

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="On this page"
        className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-4"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        <ul className="space-y-1 border-r border-border">
          {headings.map((h) => {
            const isActive = h.id === activeId
            return (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => scrollToHeading(h.id)}
                  className={cn(
                    "group relative -mr-px block w-full text-left text-sm transition-colors",
                    h.level === 3 ? "pl-5" : "pl-2",
                    "py-1 pr-3",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "absolute -right-px top-0 h-full w-px transition-colors",
                      isActive
                        ? "w-0.5 bg-foreground"
                        : "bg-transparent group-hover:bg-foreground/30",
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      isActive && "font-medium",
                      "block leading-snug",
                    )}
                  >
                    {h.text}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
