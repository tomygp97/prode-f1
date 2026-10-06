import Link from "next/link"
import { ChevronDown, ChevronRight, Users } from "lucide-react"
import { LeaguePredictionEntry } from "@/lib/api/predictions"
import { cn, initials } from "@/lib/utils"

/**
 * Lista de miembros de la liga con sus puntos de la fecha. Cada fila con predicción lleva a
 * verla: con `hrefFor` es un link (Resultados) y con `onToggle` se despliega en el lugar
 * (`renderExpanded`, carrera en curso). Los que no cargaron no se pueden abrir.
 */
export function LeaguePredictionsList({
  entries,
  currentUserId,
  selectedUserId,
  hrefFor,
  onToggle,
  renderExpanded,
}: {
  entries: LeaguePredictionEntry[]
  currentUserId?: string
  selectedUserId?: string | null
  hrefFor?: (userId: string) => string
  onToggle?: (userId: string) => void
  renderExpanded?: (entry: LeaguePredictionEntry) => React.ReactNode
}) {
  return (
    <section className="space-y-2">
      <h2 className="flex items-center gap-1.5 font-heading text-sm font-bold uppercase text-muted-foreground">
        <Users className="size-4" /> Predicciones de la liga
      </h2>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {entries.map((entry, i) => {
          const isMe = entry.userId === currentUserId
          const isSelected = entry.userId === selectedUserId
          const canOpen = entry.prediction !== null
          const expanded = isSelected && renderExpanded ? renderExpanded(entry) : null

          const row = (
            <>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                {initials(entry.name)}
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-medium">
                {entry.name} {isMe && <span className="text-xs text-primary">(vos)</span>}
              </p>
              <EntryStatus entry={entry} />
              {canOpen &&
                (renderExpanded && isSelected ? (
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                ))}
            </>
          )
          const rowClass = cn(
            "flex w-full items-center gap-2.5 px-4 py-2.5 text-left",
            isSelected && "bg-primary/10",
          )

          return (
            <div key={entry.userId} className={cn(i !== entries.length - 1 && "border-b border-border")}>
              {!canOpen ? (
                <div className={rowClass}>{row}</div>
              ) : hrefFor ? (
                <Link href={hrefFor(entry.userId)} className={cn(rowClass, "transition-colors hover:bg-secondary")}>
                  {row}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggle?.(entry.userId)}
                  aria-expanded={isSelected}
                  className={cn(rowClass, "transition-colors hover:bg-secondary")}
                >
                  {row}
                </button>
              )}
              {expanded && <div className="border-t border-border p-3">{expanded}</div>}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function EntryStatus({ entry }: { entry: LeaguePredictionEntry }) {
  if (!entry.prediction) {
    return <span className="shrink-0 text-xs text-muted-foreground">No cargó predicción</span>
  }
  if (!entry.score) return null
  return (
    <span className="shrink-0 font-heading text-base font-bold tabular-nums text-arg">+{entry.score.totalPoints}</span>
  )
}
