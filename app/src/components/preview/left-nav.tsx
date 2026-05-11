import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { scrollToHeading, type TocHeading } from "./use-headings-spy"

interface LeftNavProps {
  headings: TocHeading[]
  activeId: string | null
}

const DEPTH_X = {
  2: 0, // px from container left for top-level rail
  3: 10, // px for nested rail
} as const

const TEXT_PAD = {
  2: 14, // px text padding for top-level
  3: 26, // px text padding for nested
} as const

const ANGLE_HEIGHT = 8 // px — vertical run consumed by the diagonal connector

/**
 * Sticky left-side table of contents.
 * Desktop only — hidden below lg.
 *
 * The rail is rendered as ONE SVG path that runs the full height of the list,
 * stepping inward/outward with a short diagonal line at every indent change.
 *
 * The active heading's segment is drawn on top as a separate full-opacity line.
 */
export function LeftNav({ headings, activeId }: LeftNavProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [itemBoxes, setItemBoxes] = useState<
    Array<{ top: number; height: number }>
  >([])
  const [svgHeight, setSvgHeight] = useState(0)

  // Measure each item's top + height inside the list so we know where
  // to draw the rail. ResizeObserver handles re-measurement on tab
  // switches, font load, viewport changes.
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    function measure() {
      const ul = listRef.current
      if (!ul) return
      const items = Array.from(
        ul.querySelectorAll<HTMLElement>("[data-toc-item]"),
      )
      const ulRect = ul.getBoundingClientRect()
      const boxes = items.map((el) => {
        const r = el.getBoundingClientRect()
        return { top: r.top - ulRect.top, height: r.height }
      })
      setItemBoxes(boxes)
      setSvgHeight(ulRect.height)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    for (const el of list.querySelectorAll<HTMLElement>("[data-toc-item]")) {
      ro.observe(el)
    }
    return () => ro.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const railX = (level: number) =>
    DEPTH_X[level === 3 ? 3 : 2] + 0.5 // +0.5 for crisp 1px stroke

  const railPath = buildRailPath(headings, itemBoxes, railX)
  const activeIdx = headings.findIndex((h) => h.id === activeId)
  const activeSegment =
    activeIdx >= 0 && itemBoxes[activeIdx]
      ? {
          x: railX(headings[activeIdx].level),
          y: itemBoxes[activeIdx].top,
          h: itemBoxes[activeIdx].height,
        }
      : null

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="On this page"
        className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        <div ref={listRef} className="relative">
          {svgHeight > 0 && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0"
              width={20}
              height={svgHeight}
              viewBox={`0 0 20 ${svgHeight}`}
              fill="none"
            >
              <path
                d={railPath}
                stroke="currentColor"
                strokeWidth={1}
                strokeLinecap="square"
                className="text-foreground/15"
              />
              {activeSegment && (
                <line
                  x1={activeSegment.x}
                  y1={activeSegment.y}
                  x2={activeSegment.x}
                  y2={activeSegment.y + activeSegment.h}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="text-foreground transition-all duration-200"
                />
              )}
            </svg>
          )}
          <div>
            {headings.map((heading) => {
              const isActive = heading.id === activeId
              const isNested = heading.level >= 3
              return (
                <button
                  key={heading.id}
                  type="button"
                  data-toc-item
                  onClick={() => scrollToHeading(heading.id)}
                  style={{
                    paddingInlineStart: isNested
                      ? TEXT_PAD[3]
                      : TEXT_PAD[2],
                  }}
                  className={cn(
                    "block w-full py-1.5 pr-2 text-left text-sm leading-snug transition-colors",
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {heading.text}
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </aside>
  )
}

/**
 * Build a single SVG path that traces top-to-bottom through every heading.
 * On an indent change (current level differs from previous), insert a short
 * diagonal connector that lives in the top ~8px of the current item.
 */
function buildRailPath(
  headings: TocHeading[],
  boxes: Array<{ top: number; height: number }>,
  railX: (level: number) => number,
): string {
  if (boxes.length === 0 || boxes.length !== headings.length) return ""

  const parts: string[] = []
  for (let i = 0; i < headings.length; i++) {
    const box = boxes[i]
    const x = railX(headings[i].level)
    const yTop = box.top
    const yBottom = box.top + box.height

    if (i === 0) {
      parts.push(`M ${x} ${yTop}`)
    } else {
      const prevX = railX(headings[i - 1].level)
      if (prevX !== x) {
        // Diagonal connector: come down from prev rail to (x, yTop + ANGLE_HEIGHT)
        // The line currently ends at (prevX, prevYBottom) which equals (prevX, yTop)
        // since rows are flush. Draw diagonal to (x, yTop + ANGLE_HEIGHT) then vertical.
        parts.push(`L ${x} ${yTop + ANGLE_HEIGHT}`)
      } else {
        // Same level — line continues straight down through the boundary.
        // (No extra move needed; previous L ended at yTop already.)
      }
    }
    parts.push(`L ${x} ${yBottom}`)
  }
  return parts.join(" ")
}
