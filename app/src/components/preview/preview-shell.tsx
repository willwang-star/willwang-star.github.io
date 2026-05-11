import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeftNav } from "./left-nav"
import { MobileToc } from "./mobile-toc"
import { useHeadingsSpy } from "./use-headings-spy"

interface PreviewShellProps {
  platform: string
  title: string
  children: React.ReactNode
  /** Show the auto-generated TOC (left rail on desktop, floating pill on mobile). Default: true. */
  toc?: boolean
}

/**
 * Wrapper for every converted preview page.
 * - 1-line sticky top banner: back button + "Platform · Title"
 * - Forces dark mode (theme switching is removed sitewide)
 * - Sets the document title
 * - Optional TOC: left-side sticky nav on desktop, floating sheet on mobile.
 *   Auto-scans H2/H3 inside the content area; re-scans on tab switches.
 */
export function PreviewShell({
  platform,
  title,
  children,
  toc = true,
}: PreviewShellProps) {
  useEffect(() => {
    document.title = `${platform} · ${title} · Will's Repo`
    return () => {
      document.title = "Will's Repo"
    }
  }, [platform, title])

  const contentRef = useRef<HTMLDivElement>(null)
  const { headings, activeId } = useHeadingsSpy({ containerRef: contentRef })

  return (
    <div className="dark min-h-svh bg-background text-foreground [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-2.5 backdrop-blur sm:px-6">
        <Button asChild variant="ghost" size="sm" className="gap-2 px-2">
          <Link to="/">
            <ArrowLeftIcon className="size-4" />
            <span className="hidden sm:inline">Will's Repo</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
        <div className="hidden h-5 w-px bg-border sm:block" />
        <p className="truncate text-sm font-medium sm:text-base">
          <span className="text-muted-foreground">{platform}</span>
          <span className="mx-2 text-muted-foreground">·</span>
          <span>{title}</span>
        </p>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14">
        {toc ? (
          <div className="grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
            <LeftNav headings={headings} activeId={activeId} />
            <div ref={contentRef} className="min-w-0">
              {children}
            </div>
          </div>
        ) : (
          <div ref={contentRef} className="min-w-0">
            {children}
          </div>
        )}
      </main>

      {toc && <MobileToc headings={headings} activeId={activeId} />}
    </div>
  )
}
