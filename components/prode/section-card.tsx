import { Trophy } from "lucide-react"

export function SectionCard({
    icon: Icon,
    title,
    subtitle,
    children,
  }: {
    icon: typeof Trophy
    title: string
    subtitle?: string
    children: React.ReactNode
  }) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Icon className="size-4" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold uppercase leading-none">{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {children}
      </section>
    )
  }