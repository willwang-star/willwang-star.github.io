import {
  CalendarIcon,
  MailIcon,
  MessageSquareIcon,
  VideoIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { profile } from "@/lib/profile"

type Action = {
  label: string
  href: string | null
  icon: React.ReactNode
}

export function QuickActions({
  className,
  size = "default",
}: {
  className?: string
  size?: "default" | "sm" | "lg"
}) {
  const actions: Action[] = [
    {
      label: "Slack me",
      href: profile.contact.slack || null,
      icon: <MessageSquareIcon className="size-4" />,
    },
    {
      label: "Email",
      href: profile.contact.email
        ? `mailto:${profile.contact.email}`
        : null,
      icon: <MailIcon className="size-4" />,
    },
    {
      label: "Book a Zoom",
      href: profile.contact.zoom || null,
      icon: <VideoIcon className="size-4" />,
    },
    {
      label: "Schedule",
      href: profile.contact.calendar || null,
      icon: <CalendarIcon className="size-4" />,
    },
  ].filter((a) => a.href !== null)

  if (actions.length === 0) return null

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            asChild
            variant="secondary"
            size={size}
            className="gap-2"
          >
            <a
              href={action.href!}
              target={action.href!.startsWith("http") ? "_blank" : undefined}
              rel={
                action.href!.startsWith("http") ? "noreferrer" : undefined
              }
            >
              {action.icon}
              {action.label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}
