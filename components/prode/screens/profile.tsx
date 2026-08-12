"use client"

import { Trophy, Medal, TrendingUp, Star, Flag, Crown } from "lucide-react"
import { profile } from "@/lib/f1-data"
import { cn } from "@/lib/utils"

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Trophy
  label: string
  value: string
  accent?: "arg" | "primary"
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-lg",
          accent === "arg" ? "bg-arg/15 text-arg" : "bg-primary/15 text-primary",
        )}
      >
        <Icon className="size-4" />
      </span>
      <p className="mt-2 font-heading text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function Profile() {
  return (
    <div className="space-y-5 px-4 py-5">
      {/* Header card */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-16 w-full bg-gradient-to-r from-primary/30 via-primary/10 to-arg/20" />
        <div className="px-4 pb-4">
          <div className="-mt-8 flex items-end gap-3">
            <div className="flex size-20 items-center justify-center rounded-2xl border-4 border-card bg-secondary font-heading text-2xl font-bold">
              VO
            </div>
            <div className="pb-1">
              <h1 className="font-heading text-xl font-bold uppercase leading-none">
                {profile.name}
              </h1>
              <p className="text-sm text-muted-foreground">{profile.username}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-arg/15 px-2.5 py-1 text-xs font-semibold text-arg">
              <Trophy className="size-3" /> {profile.rank}º en la liga
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
              {profile.racesPlayed} fechas jugadas
            </span>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={Crown} label="Puntos totales" value={String(profile.totalPoints)} accent="primary" />
        <Stat icon={TrendingUp} label="Posición actual" value={`${profile.rank}º`} accent="arg" />
        <Stat icon={Medal} label="Victorias de fecha" value={String(profile.raceWins)} accent="primary" />
        <Stat icon={Star} label="Promedio x carrera" value={String(profile.avgPerRace)} accent="arg" />
      </div>

      {/* Best race */}
      <section className="flex items-center justify-between rounded-2xl border border-arg/40 bg-gradient-to-r from-arg/15 to-transparent p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-arg/20 text-arg">
            <Star className="size-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Mejor fecha</p>
            <p className="font-heading text-base font-bold">{profile.bestRace.gp}</p>
          </div>
        </div>
        <span className="font-heading text-3xl font-bold text-arg">+{profile.bestRace.points}</span>
      </section>

      {/* History */}
      <section>
        <h2 className="mb-3 font-heading text-lg font-bold uppercase">Historial</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {profile.history.map((h, i) => (
            <div
              key={h.round}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                i !== profile.history.length - 1 && "border-b border-border",
              )}
            >
              <span className="font-mono text-xs text-muted-foreground">R{h.round}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{h.gp}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Flag className="size-3" /> {h.position}º en la fecha
                </p>
              </div>
              <span
                className={cn(
                  "font-heading text-base font-bold tabular-nums",
                  h.position === 1 ? "text-arg" : "text-foreground",
                )}
              >
                +{h.points}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
