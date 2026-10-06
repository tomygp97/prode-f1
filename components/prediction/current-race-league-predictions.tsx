"use client"

import { useMemo, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useLeague } from "@/context/league-context"
import { useLeagueRacePredictions } from "@/hooks/use-league-race-predictions"
import { useRaceEntries } from "@/hooks/use-race-entries"
import { useDrivers } from "@/hooks/use-drivers"
import { useTeams } from "@/hooks/use-teams"
import { LeagueSwitcherButton } from "@/components/prode/active-league-switcher"
import { LeaguePredictionsList } from "@/components/results/league-predictions-list"
import { MemberPredictionCard } from "./member-prediction-card"

/**
 * Carrera en curso (predicciones ya cerradas): qué predijo cada miembro de la liga activa.
 * Mientras las predicciones estén abiertas el back no las devuelve y esto no muestra nada.
 */
export function CurrentRaceLeaguePredictions({ raceId }: { raceId: string }) {
  const { token, user } = useAuth()
  const { activeLeague } = useLeague()
  const { entries, hidden, isLoading, error } = useLeagueRacePredictions(token, activeLeague?.league.id, raceId)
  const [openUserId, setOpenUserId] = useState<string | null>(null)

  // Grilla de esta carrera (equipo de ese fin de semana) + plantel, por si alguien eligió a un piloto que no corre
  const { drivers: gridDrivers, teams: gridTeams } = useRaceEntries(raceId)
  const { drivers: rosterDrivers } = useDrivers()
  const { teams: rosterTeams } = useTeams()
  const lookup = useMemo(() => {
    const gridIds = new Set(gridDrivers.map((driver) => driver.id))
    const gridTeamIds = new Set(gridTeams.map((team) => team.id))
    return {
      drivers: [...gridDrivers, ...rosterDrivers.filter((driver) => !gridIds.has(driver.id))],
      teams: [...gridTeams, ...rosterTeams.filter((team) => !gridTeamIds.has(team.id))],
    }
  }, [gridDrivers, gridTeams, rosterDrivers, rosterTeams])

  if (!activeLeague || hidden) return null
  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando predicciones de la liga...</p>
  if (error) return <p className="text-sm text-primary">{error}</p>
  if (entries.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <LeagueSwitcherButton />
      </div>
      <LeaguePredictionsList
        entries={entries}
        currentUserId={user?.id}
        selectedUserId={openUserId}
        onToggle={(userId) => setOpenUserId((open) => (open === userId ? null : userId))}
        renderExpanded={(entry) =>
          entry.prediction && (
            <MemberPredictionCard
              prediction={entry.prediction}
              drivers={lookup.drivers}
              teams={lookup.teams}
              trackedDriverId={activeLeague.league.trackedDriverId}
            />
          )
        }
      />
    </div>
  )
}
