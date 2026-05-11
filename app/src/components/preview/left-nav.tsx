import { useLayoutEffect, useRef, useState } from "react"
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
 * Single straight vertical rail at the left edge. A single brighter
 * highlight strip slides between active items with an ease-in-out
 * transition on top + height (no font-weight change on the text).
 */
export function LeftNav({ headings, activeId }: LeftNavProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const [highlight, setHighlight] = useState<{
    top: number
    height: number
  } | null>(null)

  // Measure the active item's position so we can animate the highlight strip
  // between rows.
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    function measure() {
      const ul = listRef.current
      if (!ul || !activeId) {
        setHighlight(null)
        return
      }
      const target = ul.querySelector<HTMLElement>(
        `[data-toc-target="${CSS.escape(activeId)}"]`,
      )
      if (!target) {
        setHighlight(null)
        return
      }
      const ulRect = ul.getBoundingClientRect()
      const tRect = target.getBoundingClientRect()
      setHighlight({
        top: tRect.top - ulRect.top,
        height: tRect.height,
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [activeId, headings])

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
        <ul ref={listRef} className="relative">
          {/* Faint full-height rail. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-foreground/15"
          />

          {/* Single animated highlight strip. */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0 w-px bg-foreground transition-[top,height,opacity] duration-300 ease-in-out",
              highlight ? "opacity-100" : "opacity-0",
            )}
            style={{
              top: highlight?.top ?? 0,
              height: highlight?.height ?? 0,
            }}
          />

          {headings.map((heading) => {
            const isActive = heading.id === activeId
            const isNested = heading.level >= 3
            return (
              <li key={heading.id} data-toc-target={heading.id}>
                <button
                  type="button"
                  onClick={() => scrollToHeading(heading.id)}
                  style={{
                    paddingInlineStart: isNested
                      ? TEXT_PAD[3]
                      : TEXT_PAD[2],
                  }}
                  className={cn(
                    "block w-full py-1.5 pr-2 text-left text-sm leading-snug transition-colors duration-300 ease-in-out",
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
