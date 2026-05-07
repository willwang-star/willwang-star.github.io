import { useMemo, useState } from "react"
import { ArrowUpRight, MessageSquareIcon, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { allTags, previews } from "@/lib/previews"
import { initials, profile } from "@/lib/profile"

const baseUrl = import.meta.env.BASE_URL

function buildSlackHref(): string | null {
  if (profile.contact.slack) return profile.contact.slack
  if (profile.contact.slackUserId && profile.contact.slackTeamDomain) {
    return `https://${profile.contact.slackTeamDomain}.slack.com/team/${profile.contact.slackUserId}`
  }
  return null
}

export function HomePage() {
  const [query, setQuery] = useState("")
  const [activeTags, setActiveTags] = useState<string[]>([])

  const tags = useMemo(() => allTags(previews), [])
  const slackHref = buildSlackHref()
  const avatarSrc = profile.avatarFile ? `${baseUrl}${profile.avatarFile}` : ""

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
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            {avatarSrc && (
              <AvatarImage src={avatarSrc} alt={profile.name} />
            )}
            <AvatarFallback className="text-xl font-medium">
              {initials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Will's Repo
          </h1>
        </div>
        {slackHref && (
          <Button asChild size="sm" className="gap-2">
            <a href={slackHref} target="_blank" rel="noreferrer">
              <MessageSquareIcon className="size-4" />
              Slack me
            </a>
          </Button>
        )}
      </header>

      <section className="space-y-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search..."
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

      <section className="space-y-3">
        <p
          aria-live="polite"
          className="text-xs text-muted-foreground"
        >
          {filtered.length} of {previews.length}
          {hasActiveFilters ? " (filtered)" : ""}
        </p>

        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {filtered.map((preview) => (
            <li key={preview.slug}>
              <Link
                to={`/preview/${preview.slug}`}
                className="group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <Card className="h-full transition-colors group-hover:border-ring/60 group-hover:bg-accent/30">
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-base font-medium">
                        {preview.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1.5">
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
              </Link>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground sm:col-span-2">
              No previews match your search.
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
