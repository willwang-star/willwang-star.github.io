import { Outlet } from "react-router-dom"
import { profile } from "@/lib/profile"

export function PortalLayout() {
  return (
    <div className="dark min-h-svh bg-background text-foreground">
      <main className="mx-auto w-full max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14">
        <Outlet />
      </main>

      <footer className="mx-auto w-full max-w-[1000px] border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            {profile.team
              ? `${profile.name} · ${profile.team}`
              : profile.name}
          </span>
          {profile.contact.github && (
            <a
              href={profile.contact.github}
              className="hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              github
            </a>
          )}
        </div>
      </footer>
    </div>
  )
}
