"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Minus, Medal, Flag } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLeague } from "@/context/league-context"
import { getLeagueStandings, StandingEntry } from "@/lib/api/ranking"
import { ActiveLeagueSwitcher } from "@/components/prode/active-league-switcher"
import { cn } from "@/lib/utils"

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function Trend({ trend }: { trend: "up" | "down" | "same" }) {
  if (trend === "up") return <TrendingUp className="size-4 text-arg" />
  if (trend === "down") return <TrendingDown className="size-4 text-primary" />
  return <Minus className="size-4 text-muted-foreground" />
}

function medalColorFor(rank: number) {
  if (rank === 1) return "#FFD700"
  if (rank === 2) return "#C0C0C0"
  return "#CD7F32"
}

function heightFor(rank: number) {
  if (rank === 1) return "h-28"
  if (rank === 2) return "h-20"
  return "h-16"
}

export function Ranking() {
  const { token, user } = useAuth()
  const { activeLeague } = useLeague()
  const [standings, setStandings] = useState<StandingEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!activeLeague || !token) {
      setStandings([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    getLeagueStandings(activeLeague.league.id, token)
      .then(setStandings)
      .catch(() => setStandings([]))
      .finally(() => setIsLoading(false))
  }, [activeLeague, token])

  const rank1 = standings.find((s) => s.rank === 1)
  const rank2 = standings.find((s) => s.rank === 2)
  const rank3 = standings.find((s) => s.rank === 3)
  const podiumOrder = [rank2, rank1, rank3].filter(Boolean) as StandingEntry[]

  return (
    <div className="space-y-5 px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-bold uppercase leading-tight">Ranking General</h1>
          <p className="truncate text-sm text-muted-foreground">{activeLeague?.league.name ?? "Sin liga seleccionada"}</p>
        </div>
        <ActiveLeagueSwitcher />
      </div>

      {isLoading ? (
        <p className="text-center text-sm text-muted-foreground">Cargando ranking...</p>
      ) : !activeLeague ? (
        <p className="text-center text-sm text-muted-foreground">
          Elegí una liga para ver el ranking.
        </p>
      ) : standings.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Todavía no hay datos de ranking en esta liga.
        </p>
      ) : (
        <>
          {/* Podium */}
          {podiumOrder.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-end justify-center gap-2">
                {podiumOrder.map((s) => (
                  <div key={s.userId} className="flex flex-1 flex-col items-center">
                    <div
                      className="flex size-12 items-center justify-center rounded-full font-heading text-base font-bold text-black"
                      style={{ backgroundColor: medalColorFor(s.rank) }}
                    >
                      {initials(s.userName)}
                    </div>
                    <p className="mt-1.5 max-w-full truncate text-xs font-semibold">{s.userName}</p>
                    <p className="font-heading text-sm font-bold text-arg">{s.totalPoints}</p>
                    <div
                      className={cn(
                        "mt-2 flex w-full items-start justify-center rounded-t-lg pt-2",
                        heightFor(s.rank),
                      )}
                      style={{ background: `linear-gradient(180deg, ${medalColorFor(s.rank)}30, transparent)` }}
                    >
                      <span className="font-heading text-2xl font-bold" style={{ color: medalColorFor(s.rank) }}>
                        {s.rank}º
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Full table */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 border-b border-border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Pos</span>
              <span>Usuario</span>
              <span className="flex items-center gap-1">
                <Flag className="size-3" />
              </span>
              <span>Pts</span>
            </div>
            {standings.map((s, i) => (
              <div
                key={s.userId}
                className={cn(
                  "grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 px-4 py-2.5",
                  i !== standings.length - 1 && "border-b border-border",
                  s.userId === user?.id && "bg-primary/10",
                )}
              >
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "font-heading text-sm font-bold",
                      s.rank <= 3 ? "text-arg" : "text-foreground",
                    )}
                  >
                    {s.rank}
                  </span>
                </div>
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                    {initials(s.userName)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {s.userName} {s.userId === user?.id && <span className="text-xs text-primary">(vos)</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trend trend={s.trend} />
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Medal className="size-3" />
                    {s.raceWins}
                  </span>
                </div>
                <span className="font-heading text-base font-bold tabular-nums">{s.totalPoints}</span>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  )
}