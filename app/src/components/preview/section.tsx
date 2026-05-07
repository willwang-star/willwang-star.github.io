import { cn } from "@/lib/utils"

interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-3", className)}>
      {eyebrow && (
        <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
      )}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
    </header>
  )
}

interface SectionProps {
  eyebrow?: string
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function Section({
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(eyebrow || title || description) && (
        <div className="space-y-2">
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-3xl text-base text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
