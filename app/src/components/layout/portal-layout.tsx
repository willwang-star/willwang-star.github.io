import { NavLink, Outlet } from "react-router-dom"
import { MenuIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { initials, profile } from "@/lib/profile"

const baseUrl = import.meta.env.BASE_URL

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/work", label: "Work" },
  { to: "/chat", label: "Chat" },
  { to: "/contact", label: "Contact" },
]

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    "rounded-md px-3 py-1.5 text-sm transition-colors",
    isActive
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
  )
}

export function PortalLayout() {
  const avatarSrc = profile.avatarFile ? `${baseUrl}${profile.avatarFile}` : ""

  return (
    <div className="dark min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2.5">
            <Avatar className="size-7">
              {avatarSrc && <AvatarImage src={avatarSrc} alt={profile.name} />}
              <AvatarFallback className="text-xs font-medium">
                {initials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{profile.name}</span>
          </NavLink>

          <nav className="hidden items-center gap-1 sm:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                aria-label="Open menu"
              >
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>{profile.name}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <Outlet />
      </main>

      <footer className="mx-auto w-full max-w-5xl border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            {profile.name} · {profile.team}
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
