import { useEffect, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { findPreviewBySlug } from "@/lib/previews"

const baseUrl = import.meta.env.BASE_URL

function fileHref(file: string) {
  return baseUrl + encodeURIComponent(file)
}

export function PreviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const preview = slug ? findPreviewBySlug(slug) : undefined
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = preview ? `${preview.title} · Will's Repo` : "Will's Repo"
    return () => {
      document.title = "Will's Repo"
    }
  }, [preview])

  if (!preview) {
    return <Navigate to="/" replace />
  }

  const src = fileHref(preview.file)

  return (
    <div className="dark fixed inset-0 flex flex-col bg-background text-foreground">
      <header className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeftIcon className="size-4" />
              <span className="hidden sm:inline">Will's Repo</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
          <div className="hidden h-5 w-px bg-border sm:block" />
          <h1 className="truncate text-sm font-medium sm:text-base">
            {preview.title}
          </h1>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <a href={src} target="_blank" rel="noreferrer">
            <ExternalLinkIcon className="size-4" />
            <span className="hidden sm:inline">Open standalone</span>
          </a>
        </Button>
      </header>

      <div className="relative flex-1 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="size-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
          </div>
        )}
        <iframe
          key={preview.slug}
          src={src}
          title={preview.title}
          className="size-full border-0"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  )
}
