import { useEffect, useState } from "react"

export type TocHeading = {
  id: string
  text: string
  level: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Scans a container for visible H2/H3 elements, auto-assigns IDs if missing,
 * and tracks which heading is currently in the viewport via IntersectionObserver.
 *
 * Re-scans automatically when the DOM inside the container changes
 * (covers tab switches that mount/unmount panels with new headings).
 */
export function useHeadingsSpy({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>
}) {
  const [headings, setHeadings] = useState<TocHeading[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      setHeadings([])
      return
    }

    function rescan() {
      const c = containerRef.current
      if (!c) return
      const nodes = Array.from(
        c.querySelectorAll<HTMLHeadingElement>("h2, h3"),
      ).filter((el) => !el.dataset.tocSkip)

      const found: TocHeading[] = nodes
        .map((el) => {
          let assignedId = el.id
          if (!assignedId) {
            assignedId = slugify(el.textContent || "")
            if (assignedId) el.id = assignedId
          }
          return {
            id: assignedId,
            text: el.textContent?.trim() || "",
            level: Number(el.tagName.replace("H", "")),
          }
        })
        .filter((h) => h.id && h.text)

      setHeadings((prev) => {
        // Only update when the list actually changed (cheap shallow compare).
        if (
          prev.length === found.length &&
          prev.every((h, i) => h.id === found[i].id)
        ) {
          return prev
        }
        return found
      })
    }

    rescan()
    const observer = new MutationObserver(() => {
      // Defer so all DOM mutations in the batch settle.
      requestAnimationFrame(rescan)
    })
    observer.observe(container, {
      childList: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [containerRef])

  // Observe heading visibility.
  useEffect(() => {
    if (headings.length === 0) return
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // Track which headings are currently intersecting so we can pick the
    // top-most one as "active" even when several are in view at once.
    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // Pick the first heading (in document order) that's currently visible.
        const ordered = headings.map((h) => h.id)
        const next = ordered.find((id) => visible.has(id))
        if (next) setActiveId(next)
      },
      {
        // Trigger when the heading crosses ~64px below the viewport top
        // (banner ~48px + breathing).
        rootMargin: "-64px 0px -70% 0px",
        threshold: 0,
      },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [headings])

  return { headings, activeId }
}

export function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  // Update URL hash without jumping (smooth scroll happens below).
  history.replaceState(null, "", `#${id}`)
  el.scrollIntoView({ behavior: "smooth", block: "start" })
}
