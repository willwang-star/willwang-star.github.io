import { ArrowRightIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QuickActions } from "@/components/quick-actions"
import { profile } from "@/lib/profile"
import { previews } from "@/lib/previews"

const baseUrl = import.meta.env.BASE_URL

export function HomePage() {
  const recent = previews.slice(0, 3)

  return (
    <div className="space-y-12">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {profile.name}
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          {profile.role} · {profile.team}
        </p>
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
    </div>
  )
}
