"use client"

import { useAuth } from "@/context/auth-context"
import { useLeague } from "@/context/league-context"
import { useLeagueStandings } from "@/hooks/use-league-standings"
import { RankingHeader } from "@/components/ranking/ranking-header"
import { Podium } from "@/components/ranking/podium"
import { StandingsTable } from "@/components/ranking/standings-table"

function Message({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "error" }) {
  return (
    <p className={tone === "error" ? "text-center text-sm text-primary" : "text-center text-sm text-muted-foreground"}>
      {children}
    </p>
  )
}

export function Ranking() {
  const { token, user } = useAuth()
  const { activeLeague, isLoading: leaguesLoading } = useLeague()
  const { standings, isLoading, error } = useLeagueStandings(token, activeLeague?.league.id)

  return (
    <div className="space-y-5 px-4 py-5">
      <RankingHeader leagueName={activeLeague?.league.name} />

      {leaguesLoading || isLoading ? (
        <Message>Cargando ranking...</Message>
      ) : !activeLeague ? (
        <Message>Elegí una liga para ver el ranking.</Message>
      ) : error ? (
        <Message tone="error">{error}</Message>
      ) : standings.length === 0 ? (
        <Message>Todavía no hay datos de ranking en esta liga.</Message>
      ) : (
        <>
          <Podium standings={standings} />
          <StandingsTable standings={standings} currentUserId={user?.id} />
        </>
      )}
    </div>
  )
}
