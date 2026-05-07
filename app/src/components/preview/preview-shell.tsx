import { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PreviewShellProps {
  platform: string
  title: string
  children: React.ReactNode
}

/**
 * Wrapper for every converted preview page.
 * - 1-line sticky top banner: back button + "Platform · Title"
 * - Forces dark mode (theme switching is removed sitewide)
 * - Sets the document title
 * - Body is rendered into a centered max-1000px column
 */
export function PreviewShell({
  platform,
  title,
  children,
}: PreviewShellProps) {
  useEffect(() => {
    document.title = `${platform} · ${title} · Will's Repo`
    return () => {
      document.title = "Will's Repo"
    }
  }, [platform, title])

  return (
    <div className="dark min-h-svh bg-background text-foreground">
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

      <main className="mx-auto w-full max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </main>
    </div>
  )
}
