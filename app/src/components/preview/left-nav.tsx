import { cn } from "@/lib/utils"
import { scrollToHeading, type TocHeading } from "./use-headings-spy"

interface LeftNavProps {
  headings: TocHeading[]
  activeId: string | null
}

const DEPTH_X = {
  2: 0, // px from container left for top-level
  3: 10, // px for nested
} as const

const TEXT_PAD = {
  2: 14, // px text padding for top-level (matches claudefa.st)
  3: 26, // px text padding for nested
} as const

/**
 * Sticky left-side table of contents.
 * Desktop only — hidden below lg.
 *
 * Each item has its own 1px vertical rail piece at the left edge,
 * positioned by depth (depth 2 → x=0, depth 3 → x=10).
 *
 * At nesting transitions (a deeper level appears below, or a shallower
 * level appears below), the rail piece is chopped 6px short (top-1.5 or
 * bottom-1.5) to create a small visual gap — matching the claudefa.st
 * Fumadocs pattern.
 *
 * The active item's rail piece is full-opacity foreground; all others
 * are foreground/15.
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
        <ul className="flex flex-col">
          {headings.map((heading, idx) => {
            const isActive = heading.id === activeId
            const depth = (heading.level === 3 ? 3 : 2) as 2 | 3
            const railX = DEPTH_X[depth]
            const textPad = TEXT_PAD[depth]

            const next = headings[idx + 1]
            const nextDepth = next
              ? ((next.level === 3 ? 3 : 2) as 2 | 3)
              : depth

            // Chop the rail's bottom 6px when the next item is at a
            // different depth (signals a transition).
            const chopBottom = next && nextDepth !== depth
            // Chop the rail's top 6px when the previous item was at a
            // different depth.
            const prev = headings[idx - 1]
            const prevDepth = prev
              ? ((prev.level === 3 ? 3 : 2) as 2 | 3)
              : depth
            const chopTop = prev && prevDepth !== depth

            return (
              <button
                key={heading.id}
                type="button"
                onClick={() => scrollToHeading(heading.id)}
                style={{ paddingInlineStart: textPad }}
                className={cn(
                  "relative w-full py-1.5 pr-2 text-left text-sm leading-snug transition-colors",
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {/* Per-item rail piece. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute w-px transition-colors",
                    isActive ? "bg-foreground" : "bg-foreground/15",
                    chopTop ? "top-1.5" : "top-0",
                    chopBottom ? "bottom-1.5" : "bottom-0",
                  )}
                  style={{ insetInlineStart: railX }}
                />
                {heading.text}
              </button>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
