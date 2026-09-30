"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarDays, ChevronRight, Flag, MapPin, Timer } from "lucide-react"
import { useRouter } from "next/navigation"
import { RaceFromApi, toGrandPrix } from "@/lib/api/races"
import { formatArgDateTime } from "@/lib/races/weekend"
import { useNow } from "@/hooks/use-now"
import { Countdown, shortTimeUntil } from "./countdown"

function Schedule({ label, iso }: { label: string; iso: string }) {
  const { day, time } = formatArgDateTime(iso)
  return (
    <span className="flex items-center gap-2">
      <CalendarDays className="size-4 shrink-0 text-primary" />
      <span>
        {label}: <span className="capitalize">{day}</span>
        {time && ` · ${time}`}
      </span>
    </span>
  )
}

/**
 * Próximo GP con predicciones abiertas. La cuenta regresiva va hasta la qualy: es el plazo
 * para predecir. `compact` = versión chica debajo de la tarjeta en vivo del fin de semana.
 */
export function NextGpCard({ race, compact = false }: { race: RaceFromApi; compact?: boolean }) {
  const router = useRouter()
  const gp = toGrandPrix(race)
  const now = useNow()

  if (compact) {
    return (
      <Link
        href="/predictions?race=next"
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Próximo GP · Fecha {gp.round}</p>
          <p className="truncate font-heading text-lg font-bold uppercase leading-tight">
            {gp.flag} {gp.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-arg">
            <Timer className="size-3.5" /> Predicciones abiertas · cierran en {shortTimeUntil(gp.qualifyingDate, now)}
          </p>
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
      </Link>
    )
  }

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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-arg/20 px-2.5 py-1 text-xs font-semibold text-arg">
              <span className="size-1.5 rounded-full bg-arg" />
              Predicciones abiertas
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
            {gp.qualifyingDate && <Schedule label="Clasificación" iso={gp.qualifyingDate} />}
            <Schedule label="Carrera" iso={gp.date} />
          </div>

          {gp.qualifyingDate && (
            <Countdown target={gp.qualifyingDate} label="Las predicciones cierran en" />
          )}

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
