import { TrendingUp, TrendingDown, Minus, Medal } from "lucide-react"
import { StandingEntry } from "@/lib/api/ranking"
import { cn, initials } from "@/lib/utils"

function TrendIcon({ trend }: { trend: StandingEntry["trend"] }) {
  if (trend === "up") return <TrendingUp className="size-4 text-arg" aria-label="Subió" />
  if (trend === "down") return <TrendingDown className="size-4 text-primary" aria-label="Bajó" />
  return <Minus className="size-4 text-muted-foreground" aria-label="Igual" />
}

const columns = "grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 px-4"

export function StandingsTable({
  standings,
  currentUserId,
  showHeader = true,
}: {
  standings: StandingEntry[]
  currentUserId?: string
  showHeader?: boolean
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      {showHeader && (
        <div
          className={cn(
            columns,
            "border-b border-border py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
          )}
        >
          <span>Pos</span>
          <span>Usuario</span>
          <span className="flex items-center gap-1" title="Tendencia y fechas ganadas">
            <Medal className="size-3" />
          </span>
          <span>Pts</span>
        </div>
      )}
      {standings.map((s, i) => {
        const isMe = s.userId === currentUserId
        return (
          <div
            key={s.userId}
            className={cn(
              columns,
              "py-2.5",
              i !== standings.length - 1 && "border-b border-border",
              isMe && "bg-primary/10",
            )}
          >
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
          </div>
        )
      })}
    </section>
  )
}
