import Link from "next/link"
import { TrendingUp, TrendingDown, Minus, Medal, ChevronRight } from "lucide-react"
import { StandingEntry } from "@/lib/api/ranking"
import { cn, initials } from "@/lib/utils"

function TrendIcon({ trend }: { trend: StandingEntry["trend"] }) {
  if (trend === "up") return <TrendingUp className="size-4 text-arg" aria-label="Subió" />
  if (trend === "down") return <TrendingDown className="size-4 text-primary" aria-label="Bajó" />
  return <Minus className="size-4 text-muted-foreground" aria-label="Igual" />
}

const columns = "grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 px-4"
// Con filas navegables se suma una columna para el chevron
const linkColumns = "grid grid-cols-[2rem_1fr_auto_auto_1rem] items-center gap-3 px-4"

export function StandingsTable({
  standings,
  currentUserId,
  showHeader = true,
  hrefFor,
}: {
  standings: StandingEntry[]
  currentUserId?: string
  showHeader?: boolean
  /** Si viene, cada fila es un link (ej. a la predicción de ese usuario). */
  hrefFor?: (userId: string) => string
}) {
  const gridColumns = hrefFor ? linkColumns : columns

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      {showHeader && (
        <div
          className={cn(
            gridColumns,
            "border-b border-border py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
          )}
        >
          <span>Pos</span>
          <span>Usuario</span>
          <span className="flex items-center gap-1" title="Tendencia y fechas ganadas">
            <Medal className="size-3" />
          </span>
          <span>Pts</span>
          {hrefFor && <span />}
        </div>
      )}
      {standings.map((s, i) => {
        const isMe = s.userId === currentUserId
        const rowClass = cn(
          gridColumns,
          "py-2.5",
          i !== standings.length - 1 && "border-b border-border",
          isMe && "bg-primary/10",
          hrefFor && "transition-colors hover:bg-secondary",
        )
        const cells = (
          <>
            <span className={cn("font-heading text-sm font-bold", s.rank <= 3 ? "text-arg" : "text-foreground")}>
              {s.rank}
            </span>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                {initials(s.userName)}
              </span>
              <p className="min-w-0 truncate text-sm font-medium">
                {s.userName} {isMe && <span className="text-xs text-primary">(vos)</span>}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendIcon trend={s.trend} />
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground" title="Fechas ganadas">
                <Medal className="size-3" />
                {s.raceWins}
              </span>
            </div>
            <span className="font-heading text-base font-bold tabular-nums">{s.totalPoints}</span>
            {hrefFor && <ChevronRight className="size-4 text-muted-foreground" />}
          </>
        )
        return hrefFor ? (
          <Link key={s.userId} href={hrefFor(s.userId)} className={rowClass}>
            {cells}
          </Link>
        ) : (
          <div key={s.userId} className={rowClass}>
            {cells}
          </div>
        )
      })}
    </section>
  )
}
