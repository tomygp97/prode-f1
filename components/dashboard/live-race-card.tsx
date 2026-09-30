"use client"

import Link from "next/link"
import { Eye, Lock } from "lucide-react"
import { RaceFromApi, toGrandPrix } from "@/lib/api/races"
import { formatArgDateTime, getWeekendPhase, WeekendPhase } from "@/lib/races/weekend"
import { useNow } from "@/hooks/use-now"
import { cn } from "@/lib/utils"
import { Countdown } from "./countdown"

type PhaseConfig = { title: string; tone: string; live: boolean }

const PHASES: Record<WeekendPhase, PhaseConfig> = {
  qualifying: { title: "Clasificación en curso", tone: "amber", live: true },
  "waiting-race": { title: "Esperando la carrera", tone: "amber", live: false },
  race: { title: "Carrera en curso", tone: "primary", live: true },
  "results-pending": { title: "Carrera terminada", tone: "arg", live: false },
}

const TONES: Record<string, { card: string; chip: string; dot: string }> = {
  amber: { card: "border-amber-400/50", chip: "bg-amber-400/15 text-amber-400", dot: "bg-amber-400" },
  primary: { card: "border-primary/60", chip: "bg-primary/15 text-primary", dot: "bg-primary" },
  arg: { card: "border-arg/50", chip: "bg-arg/15 text-arg", dot: "bg-arg" },
}

function describe(phase: WeekendPhase, raceStartAt: string | null): string {
  if (phase === "qualifying") return "Ya no se pueden cargar ni cambiar predicciones para esta fecha."
  if (phase === "race") return "Tus puntos aparecen en Resultados apenas termine la carrera."
  if (phase === "results-pending") return "Calculando resultados y puntos: en unos minutos los ves en Resultados."
  const { day, time } = formatArgDateTime(raceStartAt)
  return `Largada: ${day}${time ? ` · ${time}` : ""}.`
}

/** Fin de semana en curso: la qualy ya empezó y todavía no hay resultados. */
export function LiveRaceCard({ race }: { race: RaceFromApi }) {
  const gp = toGrandPrix(race)
  const phase = getWeekendPhase(race, useNow())
  const config = PHASES[phase]
  const tone = TONES[config.tone]

  return (
    <section className={cn("space-y-4 rounded-2xl border-2 bg-card p-4", tone.card)}>
      <div className="flex items-center justify-between gap-2">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", tone.chip)}>
          <span className={cn("size-2 rounded-full", tone.dot, config.live && "animate-pulse")} />
          {config.title}
        </span>
        <span className="font-mono text-xs text-muted-foreground">Fecha {gp.round}</span>
      </div>

      <div>
        <h1 className="font-heading text-2xl font-bold uppercase leading-tight">
          {gp.flag} {gp.name}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" /> Predicciones cerradas
        </p>
      </div>

      <p className="text-sm text-muted-foreground">{describe(phase, race.raceStartAt)}</p>

      {phase === "waiting-race" && race.raceStartAt && (
        <Countdown target={race.raceStartAt} label="La carrera empieza en" />
      )}

      <Link
        href="/predictions"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 font-heading text-sm font-bold uppercase tracking-wide hover:bg-secondary"
      >
        <Eye className="size-4" /> Ver mi predicción
      </Link>
    </section>
  )
}
