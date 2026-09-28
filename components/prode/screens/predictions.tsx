"use client"

import { useState } from "react"
import Link from "next/link"
import { Lock, Users } from "lucide-react"
import { useLeague } from "@/context/league-context"
import { useRaceWeekend } from "@/hooks/use-race-weekend"
import { useNow } from "@/hooks/use-now"
import { RaceFromApi, toGrandPrix } from "@/lib/api/races"
import { getWeekendPhase, WeekendPhase } from "@/lib/races/weekend"
import { cn } from "@/lib/utils"
import { PredictionForm } from "@/components/prediction/prediction-form"

const lockedNotice: Record<WeekendPhase, string> = {
  qualifying: "Se está corriendo la clasificación: tu predicción ya no se puede cambiar.",
  "waiting-race": "La clasificación terminó: tu predicción quedó cerrada hasta la carrera.",
  race: "La carrera está en curso: mirá cómo va tu predicción.",
  "results-pending": "La carrera terminó: estamos calculando los resultados y tus puntos.",
}

type Tab = "current" | "next"

/**
 * Durante un fin de semana en curso hay dos pestañas: la carrera en curso (solo lectura) y la
 * próxima (editable). Fuera del fin de semana, solo el formulario del próximo GP.
 */
export function Predictions({ initialTab }: { initialTab?: Tab }) {
  const { leagues, isLoading: leaguesLoading, error: leaguesError } = useLeague()
  const { current, next, isLoading: racesLoading, error: racesError } = useRaceWeekend()
  const now = useNow()
  const [selectedTab, setSelectedTab] = useState<Tab | null>(initialTab ?? null)

  if (leaguesLoading || racesLoading) {
    return <div className="px-4 py-5 text-muted-foreground">Cargando...</div>
  }
  const fetchError = leaguesError ?? racesError
  if (fetchError) return <div className="px-4 py-5 text-primary">{fetchError}</div>

  if (!current && !next) {
    return <div className="px-4 py-5 text-muted-foreground">No hay próximo GP</div>
  }

  // Sin ligas no hay dónde guardar la predicción (se guarda por liga)
  if (leagues.length === 0) {
    const gp = toGrandPrix((next ?? current) as RaceFromApi)
    return (
      <div className="px-4 py-5">
        <section className="rounded-2xl border border-border bg-card p-5 text-center">
          <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Users className="size-5" />
          </span>
          <p className="mt-2 font-heading text-base font-bold uppercase">Todavía no estás en una liga</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Para predecir {gp.flag} {gp.name} creá una liga o unite con el código de un amigo.
          </p>
          <Link
            href="/leagues"
            className="mt-4 inline-block rounded-xl bg-primary px-4 py-2.5 font-heading text-sm font-bold uppercase text-primary-foreground"
          >
            Ir a Ligas
          </Link>
        </section>
      </div>
    )
  }

  // Pestaña activa: la elegida si existe; si no, la carrera en curso (lo que importa ese fin de semana)
  const tab: Tab =
    selectedTab === "next" && next ? "next" : selectedTab === "current" && current ? "current" : current ? "current" : "next"
  const race = (tab === "current" ? current : next) as RaceFromApi

  return (
    <div className="space-y-5 px-4 py-5">
      {current && next && (
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-1">
          {([
            { id: "current" as const, race: current, locked: true },
            { id: "next" as const, race: next, locked: false },
          ]).map((t) => {
            const gp = toGrandPrix(t.race)
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTab(t.id)}
                className={cn(
                  "flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 font-heading text-sm font-bold uppercase transition-colors",
                  tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {t.locked && <Lock className="size-3.5 shrink-0" />}
                <span className="truncate">{gp.flag} {gp.name.replace(" Grand Prix", "")}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* key: cada carrera arranca con su propio formulario */}
      <PredictionForm
        key={race.id}
        race={race}
        readOnly={tab === "current"}
        notice={tab === "current" ? lockedNotice[getWeekendPhase(race, now)] : undefined}
      />
    </div>
  )
}
