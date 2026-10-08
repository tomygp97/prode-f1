"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLeague } from "@/context/league-context"
import { useLastResultsRace } from "@/hooks/use-last-results-race"
import { useRaceResults } from "@/hooks/use-race-results"
import { useMyRaceResult } from "@/hooks/use-my-race-result"
import { useLeagueRacePredictions } from "@/hooks/use-league-race-predictions"
import { useDrivers } from "@/hooks/use-drivers"
import { useTeams } from "@/hooks/use-teams"
import { toGrandPrix } from "@/lib/api/races"
import { buildResultComparison } from "@/lib/results/buildResultComparison"
import { ResultsHeader } from "@/components/results/results-header"
import { ScoreBanner, ScoreBannerState } from "@/components/results/score-banner"
import { ComparisonCard } from "@/components/results/comparison-card"
import { FactorTile } from "@/components/results/factor-tile"
import { PointsBreakdown } from "@/components/results/points-breakdown"
import { LeaguePredictionsList } from "@/components/results/league-predictions-list"

/** `viewedUserId`: ver la predicción de otro miembro de la liga activa (sin él, la mía). */
export function Results({ viewedUserId }: { viewedUserId?: string }) {
  const { token, user } = useAuth()

  const { activeLeague, isLoading: leaguesLoading, error: leaguesError } = useLeague()
  const { race, isLoading: raceLoading, error: raceError } = useLastResultsRace()
  const { results, isLoading: resultsLoading, error: resultsError } = useRaceResults(race?.id)
  const { drivers, isLoading: driversLoading, error: driversError } = useDrivers()
  const { teams, isLoading: teamsLoading, error: teamsError } = useTeams()
  const {
    prediction: myPrediction,
    score: myScore,
    isLoading: myResultLoading,
    error: myResultError,
  } = useMyRaceResult(token, activeLeague?.league.id, race?.id)
  const {
    entries: leagueEntries,
    isLoading: leagueEntriesLoading,
    error: leagueEntriesError,
  } = useLeagueRacePredictions(token, activeLeague?.league.id, race?.id)

  const viewingOther = !!viewedUserId && viewedUserId !== user?.id
  const viewedEntry = viewingOther ? leagueEntries.find((entry) => entry.userId === viewedUserId) : undefined
  const prediction = viewingOther ? (viewedEntry?.prediction ?? null) : myPrediction
  const score = viewingOther ? (viewedEntry?.score ?? null) : myScore

  const isLoading =
    leaguesLoading || raceLoading || resultsLoading || driversLoading || teamsLoading || myResultLoading ||
    (viewingOther && leagueEntriesLoading)
  const fetchError =
    leaguesError ?? raceError ?? resultsError ?? driversError ?? teamsError ?? myResultError ??
    (viewingOther ? leagueEntriesError : null)

  // Sin liga activa se muestra igual el resultado oficial, con el top 3 por defecto
  const league = activeLeague?.league
  const comparison = useMemo(() => {
    if (!results?.result) return null
    return buildResultComparison({
      league: league ?? { predictionSlots: 3, trackedDriverId: null },
      prediction,
      result: results.result,
      driverResults: results.drivers,
    })
  }, [league, prediction, results])

  // Cada piloto con el equipo con el que corrió ESTA carrera (no el actual): un cambio
  // de equipo posterior no altera los resultados viejos
  const raceDrivers = useMemo(() => {
    const teamByDriverId = new Map((results?.drivers ?? []).map((r) => [r.driverId, r.teamId]))
    return drivers.map((driver) => {
      const raceTeamId = teamByDriverId.get(driver.id)
      return raceTeamId ? { ...driver, teamId: raceTeamId } : driver
    })
  }, [drivers, results])

  if (isLoading) {
    return <div className="px-4 py-5 text-muted-foreground">Cargando...</div>
  }
  if (fetchError) return <div className="px-4 py-5 text-primary">{fetchError}</div>

  if (!race || !results || !comparison) {
    return (
      <div className="px-4 py-5 text-muted-foreground">
        Todavía no hay resultados oficiales esta temporada.
      </div>
    )
  }

  const gp = toGrandPrix(results.race)

  const backToMine = viewingOther && (
    <Link href="/results" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
      <ArrowLeft className="size-4" /> Volver a mis resultados
    </Link>
  )

  // Otro usuario que no está (o ya no está) en la liga activa
  if (viewingOther && !viewedEntry) {
    return (
      <div className="space-y-4 px-4 py-5">
        {backToMine}
        <p className="text-muted-foreground">Ese usuario no está en tu liga activa.</p>
      </div>
    )
  }

  const bannerState: ScoreBannerState = !league
    ? { kind: "no-league" }
    : !prediction
      ? { kind: "no-prediction" }
      : !score
        ? { kind: "pending" }
        : { kind: "score", total: score.totalPoints }

  const acronymOf = (driverId: string | null) =>
    drivers.find((d) => d.id === driverId)?.acronym ?? "—"

  const { safetyCar, dnf, trackedDriver } = comparison

  return (
    <div className="space-y-5 px-4 py-5">
      {backToMine}
      <ResultsHeader gp={gp} />

      <ScoreBanner state={bannerState} name={viewedEntry?.name} />

      <ComparisonCard
        comparison={comparison}
        drivers={raceDrivers}
        teams={teams}
        showPrediction={prediction !== null}
        predictionTitle={viewedEntry ? `Predicción de ${viewedEntry.name}` : undefined}
      />

      <div className={trackedDriver ? "grid grid-cols-3 gap-3" : "grid grid-cols-2 gap-3"}>
        <FactorTile
          label="Safety Car"
          predicted={safetyCar.predicted === null ? null : safetyCar.predicted ? "Sí" : "No"}
          actual={safetyCar.actual ? "Sí" : "No"}
          state={safetyCar.state}
        />
        <FactorTile
          label="DNF"
          predicted={dnf.predicted === null ? null : String(dnf.predicted)}
          actual={String(dnf.actual)}
          state={dnf.state}
        />
        {trackedDriver && (
          <FactorTile
            label={acronymOf(trackedDriver.driverId)}
            predicted={trackedDriver.predicted === null ? null : `P${trackedDriver.predicted}`}
            actual={trackedDriver.actual === null ? "—" : `P${trackedDriver.actual}`}
            state={trackedDriver.state}
          />
        )}
      </div>

      {score && prediction && (
        <PointsBreakdown score={score} comparison={comparison} acronymOf={acronymOf} />
      )}

      {league && leagueEntries.length > 0 && (
        <LeaguePredictionsList
          entries={leagueEntries}
          currentUserId={user?.id}
          selectedUserId={viewingOther ? viewedUserId : user?.id}
          hrefFor={(userId) => (userId === user?.id ? "/results" : `/results?user=${userId}`)}
        />
      )}
    </div>
  )
}
