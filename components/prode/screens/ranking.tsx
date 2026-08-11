"use client"

import { TrendingUp, TrendingDown, Minus, Medal, Flag } from "lucide-react"
import { league } from "@/lib/f1-data"
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

export function Ranking() {
  const members = league.members
  const podium = members.slice(0, 3)
  const rest = members.slice(3)
  // reorder podium for visual: 2nd, 1st, 3rd
  const order = [podium[1], podium[0], podium[2]]
  const medalColor = ["#C0C0C0", "#FFD700", "#CD7F32"]
  const heights = ["h-20", "h-28", "h-16"]
  const ranks = [2, 1, 3]

  return (
    <div className="space-y-5 px-4 py-5">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase leading-tight">Ranking General</h1>
        <p className="text-sm text-muted-foreground">{league.name} · Temporada {league.season}</p>
      </div>

      {/* Podium */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-end justify-center gap-2">
          {order.map((m, i) => (
            <div key={m.id} className="flex flex-1 flex-col items-center">
              <div
                className="flex size-12 items-center justify-center rounded-full font-heading text-base font-bold text-black"
                style={{ backgroundColor: medalColor[i] }}
              >
                {initials(m.name)}
              </div>
              <p className="mt-1.5 max-w-full truncate text-xs font-semibold">{m.name}</p>
              <p className="font-heading text-sm font-bold text-arg">{m.points}</p>
              <div
                className={cn(
                  "mt-2 flex w-full items-start justify-center rounded-t-lg pt-2",
                  heights[i],
                )}
                style={{ background: `linear-gradient(180deg, ${medalColor[i]}30, transparent)` }}
              >
                <span className="font-heading text-2xl font-bold" style={{ color: medalColor[i] }}>
                  {ranks[i]}º
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

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
        {members.map((m, i) => (
          <div
            key={m.id}
            className={cn(
              "grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 px-4 py-2.5",
              i !== members.length - 1 && "border-b border-border",
              m.isMe && "bg-primary/10",
            )}
          >
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "font-heading text-sm font-bold",
                  i < 3 ? "text-arg" : "text-foreground",
                )}
              >
                {i + 1}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                {initials(m.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {m.name} {m.isMe && <span className="text-xs text-primary">(vos)</span>}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">@{m.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Trend trend={m.trend} />
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Medal className="size-3" />
                {m.raceWins}
              </span>
            </div>
            <span className="font-heading text-base font-bold tabular-nums">{m.points}</span>
          </div>
        ))}
      </section>
      <p className="text-center text-[11px] text-muted-foreground">
        Las victorias de fecha se muestran junto al indicador de tendencia.
      </p>
    </div>
  )
}
