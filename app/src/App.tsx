import { useMemo, useState } from "react"
import { ArrowUpRight, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { allTags, previews } from "@/lib/previews"

const baseUrl = import.meta.env.BASE_URL

function buildHref(file: string) {
  return `${baseUrl}${encodeURIComponent(file)}`
}

function App() {
  const [query, setQuery] = useState("")
  const [activeTags, setActiveTags] = useState<string[]>([])

  const tags = useMemo(() => allTags(previews), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return previews.filter((preview) => {
      const matchesQuery =
        q === "" ||
        preview.title.toLowerCase().includes(q) ||
        preview.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (preview.description?.toLowerCase().includes(q) ?? false)
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) => preview.tags.includes(tag))
      return matchesQuery && matchesTags
    })
  }, [query, activeTags])

  function toggleTag(tag: string) {
    setActiveTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    )
  }

  function clearFilters() {
    setQuery("")
    setActiveTags([])
  }

  const hasActiveFilters = query !== "" || activeTags.length > 0

  return (
    <div className="dark min-h-svh bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <header className="mb-10 space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Dev Portal — Previews
          </h1>
          <p className="text-base text-muted-foreground">
            HTML previews hosted via GitHub Pages.
          </p>
        </header>

        <section className="mb-8 space-y-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search previews..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              aria-label="Search previews"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => {
              const isActive = activeTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={isActive}
                  className="rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className="cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors hover:bg-accent"
                  >
                    {tag}
                  </Badge>
                </button>
              )
            })}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-1 h-7 px-2 text-xs text-muted-foreground"
              >
                Clear
              </Button>
            )}
          </div>
        </section>

        <section
          aria-live="polite"
          className="mb-3 text-xs text-muted-foreground"
        >
          {filtered.length} of {previews.length}
          {hasActiveFilters ? " (filtered)" : ""}
        </section>

        <ul className="grid gap-3">
          {filtered.map((preview) => (
            <li key={preview.file}>
              <a
                href={buildHref(preview.file)}
                className="group block rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <Card className="transition-colors group-hover:border-ring/60 group-hover:bg-accent/30">
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <CardTitle className="text-base font-medium">
                        {preview.title}
                      </CardTitle>
                      {preview.description && (
                        <CardDescription>
                          {preview.description}
                        </CardDescription>
                      )}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {preview.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="rounded-full text-[10px] font-normal text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </CardHeader>
                </Card>
              </a>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No previews match your search.
            </li>
          )}
        </ul>

        <footer className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
          <a
            href="https://github.com/willwang-star/devportal-previews"
            className="hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            github.com/willwang-star/devportal-previews
          </a>
        </footer>
      </main>
    </div>
  )
}

export default App
