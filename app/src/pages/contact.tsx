import { CodeIcon, MailIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuickActions } from "@/components/quick-actions"
import { profile } from "@/lib/profile"

export function ContactPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Get in touch</h1>
        <p className="text-sm text-muted-foreground">
          Quickest ways to reach me. Pick whatever's easiest.
        </p>
      </header>

      <section>
        <QuickActions size="lg" />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {profile.contact.email && (
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-md bg-accent p-2">
                <MailIcon className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Email</CardTitle>
                <CardContent className="p-0 text-xs text-muted-foreground">
                  <a
                    href={`mailto:${profile.contact.email}`}
                    className="hover:text-foreground"
                  >
                    {profile.contact.email}
                  </a>
                </CardContent>
              </div>
            </CardHeader>
          </Card>
        )}
        {profile.contact.github && (
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-md bg-accent p-2">
                <CodeIcon className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">GitHub</CardTitle>
                <CardContent className="p-0 text-xs text-muted-foreground">
                  <a
                    href={profile.contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                  >
                    {profile.contact.github.replace(/^https?:\/\//, "")}
                  </a>
                </CardContent>
              </div>
            </CardHeader>
          </Card>
        )}
      </section>
    </div>
  )
}
