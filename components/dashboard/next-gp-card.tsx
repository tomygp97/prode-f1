"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { CalendarDays, Clock, Flag, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { GrandPrix } from "@/lib/f1-data"
import { cn } from "@/lib/utils"

const ARG_TIMEZONE = "America/Argentina/Buenos_Aires"

function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    const tick = () => setNow(Date.now())
    const first = setTimeout(tick, 0)
    const t = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(t)
    }
  }, [])
  if (now === null || !target) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const diff = Math.max(0, new Date(target).getTime() - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

// "dom 26 sep" y "08:00 hs ARG", en hora de Argentina
function formatRaceStart(iso: string) {
  if (!iso) return { day: "A confirmar", time: "" }
  const date = new Date(iso)
  const day = new Intl.DateTimeFormat("es-AR", {
    weekday: "short", day: "numeric", month: "short", timeZone: ARG_TIMEZONE,
  }).format(date).replace(/[.,]/g, "")
  const time = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ARG_TIMEZONE,
  }).format(date)
  return { day, time: `${time} hs ARG` }
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-full min-w-12 items-center justify-center rounded-lg border border-border bg-background/70 font-heading text-2xl font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  )
}

export function NextGpCard({ gp }: { gp: GrandPrix }) {
  const router = useRouter()
  const c = useCountdown(gp.date)
  const start = formatRaceStart(gp.date)
  const open = gp.status === "abiertas"

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold uppercase tracking-tight">Próximo Gran Premio</h1>
        <span className="font-mono text-xs text-muted-foreground">Fecha {gp.round}</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative h-44">
          <Image
            src="/fondo-dashboard.png"
            alt="Auto de Fórmula 1 en el circuito"
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
                open ? "bg-arg/20 text-arg" : "bg-primary/20 text-primary",
              )}
            >
              <span className={cn("size-1.5 rounded-full", open ? "bg-arg" : "bg-primary")} />
              Predicciones {gp.status}
            </span>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="font-heading text-3xl font-bold uppercase leading-none">
              {gp.flag} {gp.name}
            </h2>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {gp.circuit}
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 capitalize">
                <CalendarDays className="size-4 text-primary" />
                {start.day}
              </span>
              {start.time && (
                <span className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  {start.time}
                </span>
              )}
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
            onClick={() => router.push("/predictions")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-heading text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.98]"
          >
            <Flag className="size-5" />
            Hacer Predicción
          </button>
        </div>
      </div>
    </section>
  )
}
