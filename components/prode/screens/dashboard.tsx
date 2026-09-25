"use client"

import { Crown, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useNextGP } from "@/hooks/use-next-gp"
import { NextGpCard } from "@/components/dashboard/next-gp-card"
import { LeagueSummary } from "@/components/dashboard/league-summary"

export function Dashboard() {
  const router = useRouter()
  const { nextGP, isLoading, error } = useNextGP()

  return (
    <div className="space-y-5 px-4 py-5">
      {/* El próximo GP maneja sus estados: sin GP (fin de temporada) se sigue viendo la liga */}
      {isLoading ? (
        <p className="text-muted-foreground">Cargando próximo GP...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : nextGP ? (
        <NextGpCard gp={nextGP} />
      ) : (
        <p className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
          No hay próximo Gran Premio programado.
        </p>
      )}

      <LeagueSummary />

      {/* Quick links */}
      <section className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => router.push("/seasons")}
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
          onClick={() => router.push("/leagues")}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Users className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Mis Ligas</p>
            <p className="truncate text-xs text-muted-foreground">Crear, unirse o invitar</p>
          </div>
        </button>
      </section>
    </div>
  )
}
