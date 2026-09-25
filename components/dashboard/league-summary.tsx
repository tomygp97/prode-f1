"use client"

import Link from "next/link"
import { ChevronRight, Crown, Minus, TrendingDown, TrendingUp, Trophy, Users } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLeague } from "@/context/league-context"
import { useLeagueStandings } from "@/hooks/use-league-standings"
import { StandingEntry } from "@/lib/api/ranking"
import { LeagueSwitcherButton } from "@/components/prode/active-league-switcher"
import { StandingsTable } from "@/components/ranking/standings-table"

const TOP = 5

const trendLabel: Record<StandingEntry["trend"], { icon: typeof TrendingUp; text: string; className: string }> = {
  up: { icon: TrendingUp, text: "Subiste", className: "text-arg" },
  down: { icon: TrendingDown, text: "Bajaste", className: "text-primary" },
  same: { icon: Minus, text: "Igual", className: "text-muted-foreground" },
}

/**
 * Resumen de la liga activa: mi posición, mis puntos y el top 5.
 * Misma fuente y misma tabla que /ranking, así nunca se desalinean.
 */
export function LeagueSummary() {
  const { token, user } = useAuth()
  const { activeLeague, isLoading: leaguesLoading } = useLeague()
  const { standings, isLoading, error } = useLeagueStandings(token, activeLeague?.league.id)

  if (leaguesLoading) {
    return <p className="text-center text-sm text-muted-foreground">Cargando tu liga...</p>
  }

  if (!activeLeague) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4 text-center">
        <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Users className="size-5" />
        </span>
        <p className="mt-2 font-heading text-base font-bold uppercase">Todavía no estás en una liga</p>
        <p className="mt-1 text-xs text-muted-foreground">Creá una o unite con el código de un amigo para empezar a sumar.</p>
        <Link
          href="/leagues"
          className="mt-3 inline-block rounded-xl bg-primary px-4 py-2 font-heading text-sm font-bold uppercase text-primary-foreground"
        >
          Ir a Ligas
        </Link>
      </section>
    )
  }

  const me = standings.find((s) => s.userId === user?.id)
  const top = standings.slice(0, TOP)
  const meOutsideTop = me && !top.some((s) => s.userId === me.userId)
  const trend = me ? trendLabel[me.trend] : null

  return (
    <div className="space-y-5">
      {/* Liga activa: se cambia acá mismo para ver otro ranking */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-bold uppercase tracking-tight">Mi Liga</h2>
        <LeagueSwitcherButton />
      </div>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Trophy className="size-3.5" /> Mi posición
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-heading text-3xl font-bold">{me ? `${me.rank}º` : "—"}</span>
            {trend && (
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend.className}`}>
                <trend.icon className="size-3" /> {trend.text}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {me ? `de ${standings.length} en ${activeLeague.league.name}` : activeLeague.league.name}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Crown className="size-3.5" /> Puntos
          </div>
          <div className="mt-1 font-heading text-3xl font-bold">{me?.totalPoints ?? 0}</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {me?.racesCounted ? `en ${me.racesCounted} fechas` : "Todavía sin fechas puntuadas"}
          </p>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold uppercase tracking-tight">Top {TOP} de la Liga</h2>
          <Link href="/ranking" className="flex items-center text-xs font-medium text-primary">
            Ver ranking <ChevronRight className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground">Cargando ranking...</p>
        ) : error ? (
          <p className="text-center text-sm text-primary">{error}</p>
        ) : top.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Todavía no hay datos de ranking en esta liga.</p>
        ) : (
          <div className="space-y-2">
            <StandingsTable standings={top} currentUserId={user?.id} />
            {meOutsideTop && me && (
              <>
                <p className="text-center text-xs text-muted-foreground">···</p>
                <StandingsTable standings={[me]} currentUserId={user?.id} showHeader={false} />
              </>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
