import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CalloutProps {
  title?: string
  tone?: "default" | "warning" | "critical" | "positive"
  children: React.ReactNode
  className?: string
}

const toneStyles: Record<NonNullable<CalloutProps["tone"]>, string> = {
  default: "border-border",
  warning: "border-l-4 border-l-amber-500/70",
  critical: "border-l-4 border-l-rose-500/70",
  positive: "border-l-4 border-l-emerald-500/70",
}

export function Callout({
  title,
  tone = "default",
  children,
  className,
}: CalloutProps) {
  return (
    <Card className={cn(toneStyles[tone], className)}>
      <CardContent className="space-y-2 p-5 text-sm leading-relaxed">
        {title && <p className="text-base font-medium">{title}</p>}
        <div className="text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  )
}
