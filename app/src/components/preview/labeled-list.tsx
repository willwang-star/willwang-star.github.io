import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LabeledItem {
  label: string
  description?: string
  detail?: React.ReactNode
}

interface LabeledListProps {
  items: LabeledItem[]
  cols?: 1 | 2 | 3
  className?: string
}

export function LabeledList({ items, cols = 2, className }: LabeledListProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  }
  return (
    <div className={cn("grid gap-3", colClasses[cols], className)}>
      {items.map((item, i) => (
        <Card key={`${item.label}-${i}`} className="h-full">
          <CardHeader className="space-y-1.5">
            <CardTitle className="text-base font-medium">
              {item.label}
            </CardTitle>
            {item.description && (
              <CardDescription className="leading-relaxed">
                {item.description}
              </CardDescription>
            )}
          </CardHeader>
          {item.detail && (
            <CardContent className="pt-0 text-sm leading-relaxed text-muted-foreground">
              {item.detail}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
