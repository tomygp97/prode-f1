"use client"

import { useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useLeague } from "@/context/league-context"
import { useLastResultsRace } from "@/hooks/use-last-results-race"
import { useRaceResults } from "@/hooks/use-race-results"
import { useMyRaceResult } from "@/hooks/use-my-race-result"
import { useDrivers } from "@/hooks/use-drivers"
import { useTeams } from "@/hooks/use-teams"
import { toGrandPrix } from "@/lib/api/races"
import { buildResultComparison } from "@/lib/results/buildResultComparison"
import { ResultsHeader } from "@/components/results/results-header"
import { ScoreBanner, ScoreBannerState } from "@/components/results/score-banner"
import { ComparisonCard } from "@/components/results/comparison-card"
import { FactorTile } from "@/components/results/factor-tile"
import { PointsBreakdown } from "@/components/results/points-breakdown"

export function Results() {
  const { token } = useAuth()

  const { activeLeague, isLoading: leaguesLoading, error: leaguesError } = useLeague()
  const { race, isLoading: raceLoading, error: raceError } = useLastResultsRace()
  const { results, isLoading: resultsLoading, error: resultsError } = useRaceResults(race?.id)
  const { drivers, isLoading: driversLoading, error: driversError } = useDrivers()
  const { teams, isLoading: teamsLoading, error: teamsError } = useTeams()
  const {
    prediction,
    score,
    isLoading: myResultLoading,
    error: myResultError,
  } = useMyRaceResult(token, activeLeague?.league.id, race?.id)

  const isLoading =
    leaguesLoading || raceLoading || resultsLoading || driversLoading || teamsLoading || myResultLoading
  const fetchError =
    leaguesError ?? raceError ?? resultsError ?? driversError ?? teamsError ?? myResultError

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
      <ResultsHeader gp={gp} />

      <ScoreBanner state={bannerState} />

      <ComparisonCard
        comparison={comparison}
        drivers={drivers}
        teams={teams}
        showPrediction={prediction !== null}
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
    </div>
  )
}
