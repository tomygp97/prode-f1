"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal, TrendingUp, Star, Flag, Crown, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useLeague } from "@/context/league-context"
import { getLeagueStandings, LeagueRankingEntry } from "@/lib/api/ranking"
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
  const { user, token, logout } = useAuth()
  const { activeLeague } = useLeague()
  const router = useRouter()

  const [standings, setStandings] = useState<LeagueRankingEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!activeLeague || !token) {
      setIsLoading(false)
      return
    }
    getLeagueStandings(activeLeague.league.id, token)
      .then(setStandings)
      .catch(() => setStandings([]))
      .finally(() => setIsLoading(false))
  }, [activeLeague, token])

  const myStanding = standings.find((s) => s.ranking.userId === user?.id)

  function handleLogout() {
    logout()
    router.push("/login")
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?"

  return (
    <div className="space-y-5 px-4 py-5">
      {/* Header card */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-16 w-full bg-gradient-to-r from-primary/30 via-primary/10 to-arg/20" />
        <div className="px-4 pb-4">
          <div className="-mt-8 flex items-end gap-3">
            <div className="flex size-20 items-center justify-center rounded-2xl border-4 border-card bg-secondary font-heading text-2xl font-bold">
              {initials}
            </div>
            <div className="pb-1">
              <h1 className="font-heading text-xl font-bold uppercase leading-none">
                {user?.name ?? "—"}
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {myStanding && (
              <span className="inline-flex items-center gap-1 rounded-full bg-arg/15 px-2.5 py-1 text-xs font-semibold text-arg">
                <Trophy className="size-3" /> {myStanding.rank}º en {activeLeague?.league.name}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Stats grid */}
      {isLoading ? (
        <p className="text-center text-sm text-muted-foreground">Cargando estadísticas...</p>
      ) : !activeLeague ? (
        <p className="text-center text-sm text-muted-foreground">
          Todavía no estás en ninguna liga. Creá o unite a una desde &quot;Mis Ligas&quot;.
        </p>
      ) : myStanding ? (
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Crown} label="Puntos totales" value={String(myStanding.ranking.totalPoints)} accent="primary" />
          <Stat icon={TrendingUp} label="Posición actual" value={`${myStanding.rank}º`} accent="arg" />
          <Stat icon={Medal} label="Carreras puntuadas" value={String(myStanding.ranking.racesCounted)} accent="primary" />
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Todavía no tenés puntaje en {activeLeague.league.name} — cargá tu primer pronóstico.
        </p>
      )}

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="size-4" /> Cerrar sesión
      </button>
    </div>
  )
}