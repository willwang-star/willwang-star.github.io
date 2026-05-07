import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface QuoteProps {
  children: React.ReactNode
  attribution?: string
  className?: string
}

export function Quote({ children, attribution, className }: QuoteProps) {
  return (
    <Card className={cn("border-l-2 border-l-foreground/30", className)}>
      <CardContent className="space-y-2 p-5">
        <p className="text-base leading-relaxed text-foreground italic">
          "{children}"
        </p>
        {attribution && (
          <p className="text-xs text-muted-foreground">— {attribution}</p>
        )}
      </CardContent>
    </Card>
  )
}
