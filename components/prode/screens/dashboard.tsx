"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  CalendarDays,
  Clock,
  MapPin,
  TrendingUp,
  ChevronRight,
  Flag,
  Users,
  Trophy,
  Crown,
} from "lucide-react"
import { useNav } from "@/components/prode/nav-context"
import {
  league,
  myRank,
  myPoints,
} from "@/lib/f1-data"
import { cn } from "@/lib/utils"
import { useNextGP } from "@/hooks/use-next-gp"

function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  if (now === null) return { days: 0, hours: 0, minutes: 0, seconds: 0, ready: false }
  const diff = Math.max(0, new Date(target).getTime() - now)
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds, ready: true }
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-full min-w-12 items-center justify-center rounded-lg border border-border bg-background/70 font-heading text-2xl font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function Dashboard() {
  const { navigate } = useNav()
  const { nextGP, isLoading, error } = useNextGP()
  const c = useCountdown(nextGP?.date ?? "")
  if (isLoading) {
    return <div className="px-4 py-5 text-muted-foreground">Cargando...</div>
  }
  if (error) {
    return <div className="px-4 py-5 text-destructive">{error}</div>
  }
  if (!nextGP) {
    return <div className="px-4 py-5 text-muted-foreground">No hay próximo GP</div>
  }
  const top5 = league.members.slice(0, 5)
  const me = league.members.find((m) => m.isMe)

  return (
    <div className="space-y-5 px-4 py-5">
      {/* Next GP hero */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold uppercase tracking-tight">
            Próximo Gran Premio
          </h1>
          <span className="font-mono text-xs text-muted-foreground">
            Fecha {nextGP.round}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative h-44">
            <Image
                src="/fondo-dashboard.png"
                alt="Auto de Fórmula 1 en el circuito de Monza"
                fill
                priority
                sizes="(max-width: 448px) calc(100vw - 2rem), 416px"
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            <div className="absolute left-4 top-4">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                  nextGP.status === "abiertas"
                    ? "bg-arg/20 text-arg"
                    : "bg-primary/20 text-primary",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    nextGP.status === "abiertas" ? "bg-arg" : "bg-primary",
                  )}
                />
                Predicciones {nextGP.status}
              </span>
            </div>
            <div className="absolute bottom-3 left-4 right-4">
              <h2 className="font-heading text-3xl font-bold uppercase leading-none">
                {nextGP.flag} {nextGP.name}
              </h2>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                {nextGP.circuit}, {nextGP.city}
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  Dom 21 Jun
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  10:00 hs ARG
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <CountdownBox value={c.days} label="Días" />
              <CountdownBox value={c.hours} label="Hs" />
              <CountdownBox value={c.minutes} label="Min" />
              <CountdownBox value={c.seconds} label="Seg" />
            </div>

            <button
              type="button"
              onClick={() => navigate("predicciones")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-heading text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.98]"
            >
              <Flag className="size-5" />
              Hacer Predicción
            </button>
          </div>
        </div>
      </section>

      {/* My position */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Trophy className="size-3.5" /> Mi posición
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-heading text-3xl font-bold">{myRank}º</span>
            <span className="flex items-center text-xs font-semibold text-arg">
              <TrendingUp className="size-3" /> +1
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{league.name}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Crown className="size-3.5" /> Puntos
          </div>
          <div className="mt-1 font-heading text-3xl font-bold">{myPoints}</div>
          <p className="mt-0.5 text-xs text-muted-foreground">Temporada 2026</p>
        </div>
      </section>

      {/* Top 5 */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold uppercase tracking-tight">
            Top 5 de la Liga
          </h2>
          <button
            type="button"
            onClick={() => navigate("ranking")}
            className="flex items-center text-xs font-medium text-primary"
          >
            Ver ranking <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {top5.map((m, i) => (
            <div
              key={m.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                i !== top5.length - 1 && "border-b border-border",
                m.isMe && "bg-primary/10",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-md font-heading text-sm font-bold",
                  i === 0
                    ? "bg-[#FFD700] text-black"
                    : i === 1
                      ? "bg-[#C0C0C0] text-black"
                      : i === 2
                        ? "bg-[#CD7F32] text-black"
                        : "bg-secondary text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="truncate text-xs text-muted-foreground">@{m.username}</p>
              </div>
              <span className="font-heading text-base font-bold tabular-nums">{m.points}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate("temporada")}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-arg/15 text-arg">
            <Crown className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Temporada</p>
            <p className="truncate text-xs text-muted-foreground">Predicciones anuales</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => navigate("ligas")}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Users className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Mis Ligas</p>
            <p className="truncate text-xs text-muted-foreground">Crear o unirse</p>
          </div>
        </button>
      </section>
    </div>
  )
}
