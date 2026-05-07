import { ArrowRightIcon, SparklesIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QuickActions } from "@/components/quick-actions"
import { initials, profile } from "@/lib/profile"
import { previews } from "@/lib/previews"

const baseUrl = import.meta.env.BASE_URL

export function HomePage() {
  const recent = previews.slice(0, 3)
  const avatarSrc = profile.avatarFile ? `${baseUrl}${profile.avatarFile}` : ""

  return (
    <div className="space-y-12">
      <section className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar className="size-20 sm:size-24">
          {avatarSrc && <AvatarImage src={avatarSrc} alt={profile.name} />}
          <AvatarFallback className="text-2xl font-medium">
            {initials(profile.name)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {profile.name}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            {profile.role} · {profile.team}
          </p>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            {profile.bio}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Reach me
        </h2>
        <QuickActions />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Recent work
          </h2>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link to="/work">
              See all
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </Button>
        </div>
        <ul className="grid gap-3">
          {recent.map((preview) => (
            <li key={preview.file}>
              <a
                href={`${baseUrl}${encodeURIComponent(preview.file)}`}
                className="group block rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <Card className="transition-colors group-hover:border-ring/60 group-hover:bg-accent/30">
                  <CardHeader>
                    <CardTitle className="text-base font-medium">
                      {preview.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {preview.tags.join(" · ")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="rounded-md bg-accent p-2">
              <SparklesIcon className="size-4" />
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-base font-medium">
                Chat with my digital twin
              </CardTitle>
              <CardDescription>
                Ask the AI version of me for context on projects, design
                decisions, or how I'd approach a problem.
              </CardDescription>
            </div>
            <Button asChild variant="secondary" size="sm" className="gap-1">
              <Link to="/chat">
                Open chat
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
        </Card>
      </section>
    </div>
  )
}
