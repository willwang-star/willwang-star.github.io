import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  value: string
  label: string
  className?: string
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="space-y-1.5 p-4">
        <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {value}
        </p>
        <p className="text-xs font-medium text-muted-foreground sm:text-sm">
          {label}
        </p>
      </CardContent>
    </Card>
  )
}

interface StatGridProps {
  children: React.ReactNode
  cols?: 2 | 3 | 4
  className?: string
}

export function StatGrid({ children, cols = 4, className }: StatGridProps) {
  const colClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }
  return (
    <div className={cn("grid gap-3", colClasses[cols], className)}>
      {children}
    </div>
  )
}
