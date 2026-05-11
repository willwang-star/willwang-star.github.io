import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { scrollToHeading, type TocHeading } from "./use-headings-spy"

interface LeftNavProps {
  headings: TocHeading[]
  activeId: string | null
}

const RAIL_X_BASE = 0 // px from container's left for depth-2 (top-level)
const RAIL_X_INDENT = 12 // px per indent level
const TEXT_INDENT = 14 // px text padding for depth-2
const TEXT_INDENT_NESTED = 26 // px text padding for depth-3 (matches claudefa.st)
const CURVE_RADIUS = 8 // px corner radius where rail steps right

/**
 * Sticky left-side table of contents.
 * Desktop only — hidden below lg.
 *
 * The rail is a single SVG path that runs the full height of the TOC,
 * stepping inward (with a rounded corner) wherever a heading nests deeper
 * and stepping back out when it returns. The active heading's segment is
 * drawn in full-opacity foreground; the rest is muted.
 */
export function LeftNav({ headings, activeId }: LeftNavProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const [itemBoxes, setItemBoxes] = useState<
    Array<{ top: number; height: number }>
  >([])
  const [svgHeight, setSvgHeight] = useState(0)

  // Measure each item's position so we can draw the rail.
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    function measure() {
      const ul = listRef.current
      if (!ul) return
      const items = Array.from(
        ul.querySelectorAll<HTMLLIElement>("li[data-toc-item]"),
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
    return () => ro.disconnect()
  }, [headings.length])

  if (headings.length === 0) return null

  // Compute the rail path data for the entire list.
  const railX = (level: number) =>
    RAIL_X_BASE + (level - 2) * RAIL_X_INDENT
  const pathSegments = computeRailSegments(headings, itemBoxes, railX)
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
        className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        <div className="relative">
          {svgHeight > 0 && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0"
              width={20}
              height={svgHeight}
              viewBox={`0 0 20 ${svgHeight}`}
              fill="none"
            >
              {/* Faint rail */}
              <path
                d={pathSegments.full}
                stroke="currentColor"
                strokeWidth={1}
                className="text-foreground/15"
              />
              {/* Active segment, drawn on top */}
              {activeSegment && (
                <line
                  x1={activeSegment.x + 0.5}
                  y1={activeSegment.y}
                  x2={activeSegment.x + 0.5}
                  y2={activeSegment.y + activeSegment.h}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="text-foreground transition-all duration-200"
                />
              )}
            </svg>
          )}
          <ul ref={listRef} className="space-y-0">
            {headings.map((h) => {
              const isActive = h.id === activeId
              const isNested = h.level >= 3
              return (
                <li key={h.id} data-toc-item>
                  <button
                    type="button"
                    onClick={() => scrollToHeading(h.id)}
                    style={{
                      paddingInlineStart: isNested
                        ? TEXT_INDENT_NESTED
                        : TEXT_INDENT,
                    }}
                    className={cn(
                      "block w-full py-1.5 pr-2 text-left text-sm leading-snug transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                      isActive && "font-medium",
                    )}
                  >
                    {h.text}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </aside>
  )
}

/**
 * Build the SVG path that traces the rail from top to bottom, stepping right
 * (with a rounded corner) when a heading nests deeper than the previous one,
 * and stepping back left when it un-nests.
 */
function computeRailSegments(
  headings: TocHeading[],
  boxes: Array<{ top: number; height: number }>,
  railX: (level: number) => number,
) {
  if (boxes.length === 0 || boxes.length !== headings.length) {
    return { full: "" }
  }
  const r = CURVE_RADIUS
  const parts: string[] = []

  for (let i = 0; i < headings.length; i++) {
    const box = boxes[i]
    const x = railX(headings[i].level) + 0.5 // crisp 1px stroke
    const yTop = box.top
    const yBottom = box.top + box.height

    if (i === 0) {
      parts.push(`M ${x} ${yTop}`)
    } else {
      const prevLevel = headings[i - 1].level
      const curLevel = headings[i].level
      const prevX = railX(prevLevel) + 0.5
      if (curLevel > prevLevel) {
        // Step right with a rounded corner.
        // Go down to (prevX, yTop - r), then curve to (prevX + dx + r, yTop)... approximate
        const dx = x - prevX
        // Move to point just above the corner on the previous rail, then curve right.
        parts.push(`L ${prevX} ${yTop - r}`)
        parts.push(
          `Q ${prevX} ${yTop} ${prevX + Math.min(r, dx)} ${yTop}`,
        )
        parts.push(`L ${x} ${yTop}`)
      } else if (curLevel < prevLevel) {
        // Step left with a rounded corner.
        const dx = prevX - x
        parts.push(`L ${prevX} ${yTop - r}`)
        parts.push(
          `Q ${prevX} ${yTop} ${prevX - Math.min(r, dx)} ${yTop}`,
        )
        parts.push(`L ${x} ${yTop}`)
      } else {
        parts.push(`L ${x} ${yTop}`)
      }
    }
    parts.push(`L ${x} ${yBottom}`)
  }
  return { full: parts.join(" ") }
}
