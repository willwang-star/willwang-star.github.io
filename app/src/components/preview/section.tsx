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

interface CategoryProps {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

/**
 * Top-level grouping within a preview page (H2). Use this where you'd
 * previously have had a tab. Renders the category title plus everything
 * inside it as one scrollable block. Maps to a top-level entry in the TOC.
 */
export function Category({
  eyebrow,
  title,
  description,
  children,
  className,
}: CategoryProps) {
  return (
    <section className={cn("space-y-8 pt-6", className)}>
      <header className="space-y-2 border-t border-border pt-8">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-3xl text-base text-muted-foreground">
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  )
}

interface SectionProps {
  eyebrow?: string
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
}

/**
 * Section within a Category (H3). Maps to a nested/indented entry
 * in the TOC.
 */
export function Section({
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(eyebrow || title || description) && (
        <div className="space-y-1.5">
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </p>
          )}
          {title && (
            <h3 className="text-xl font-semibold tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="max-w-3xl text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
