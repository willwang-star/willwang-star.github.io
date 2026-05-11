import { useState } from "react"
import { ListIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { scrollToHeading, type TocHeading } from "./use-headings-spy"

interface MobileTocProps {
  headings: TocHeading[]
  activeId: string | null
}

/**
 * Floating pill at the bottom-right on mobile/tablet. Tap to open a Sheet
 * with the same scroll-spy headings.
 * Hidden on desktop (>= lg) where the LeftNav is visible.
 */
export function MobileToc({ headings, activeId }: MobileTocProps) {
  const [open, setOpen] = useState(false)
  if (headings.length === 0) return null

  const active = headings.find((h) => h.id === activeId) ?? headings[0]
  const idx = active ? headings.findIndex((h) => h.id === active.id) + 1 : 0

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur transition-colors hover:bg-accent"
            aria-label="Open table of contents"
          >
            <ListIcon className="size-3.5" />
            <span>
              {idx > 0 ? `${idx} / ${headings.length}` : "On this page"}
            </span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[70svh]">
          <SheetHeader>
            <SheetTitle className="text-sm">On this page</SheetTitle>
          </SheetHeader>
          <nav className="overflow-y-auto px-4 pb-6">
            <ul className="space-y-1">
              {headings.map((h) => {
                const isActive = h.id === active?.id
                return (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => {
                        scrollToHeading(h.id)
                        setOpen(false)
                      }}
                      className={cn(
                        "block w-full text-left text-sm py-2 transition-colors",
                        h.level >= 3 ? "pl-7" : "pl-3",
                        isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {h.text}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
