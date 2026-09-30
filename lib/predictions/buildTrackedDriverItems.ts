import { Driver, Team } from "../f1-data"
import { UserLeague } from "../api/leagues"

export type TrackedDriverLeague = {
    id: string
    name: string
  }
  
  export type TrackedDriverItem = {
    driver: Driver
    team?: Team
    leagues: TrackedDriverLeague[]
    position: number | null
    isPositionLocked: boolean
  }

  type BuildTrackedDriverItemsParams = {
    leagues: UserLeague[]
    drivers: Driver[]
    teams: Team[]
    predictedOrder: (string | undefined)[]
    manualPositions: Record<string, number>
  }

  export function buildTrackedDriverItems({
    leagues,
    drivers,
    teams,
    predictedOrder,
    manualPositions,
  }: BuildTrackedDriverItemsParams): TrackedDriverItem[] {
    const grouped = new Map<string, TrackedDriverItem>()
  
    for (const { league } of leagues) {
      const trackedDriverId = league.trackedDriverId
  
      if (!trackedDriverId) {
        continue
      }
  
      const driver = drivers.find(
        (driver) => driver.id === trackedDriverId,
      )
  
      if (!driver) {
        continue
      }
  
      const team = teams.find(
        (team) => team.id === driver.teamId,
      )
  
      const existing = grouped.get(trackedDriverId)
  
      if (existing) {
        existing.leagues.push({
          id: league.id,
          name: league.name,
        })
        continue
      }
  
      const predictedIndex = predictedOrder.findIndex(
        (driverId) => driverId === trackedDriverId,
      )
  
      const isPositionLocked = predictedIndex !== -1
  
      const position = isPositionLocked
        ? predictedIndex + 1
        : manualPositions[trackedDriverId] ?? null
  
      grouped.set(trackedDriverId, {
        driver,
        team,
        leagues: [
          {
            id: league.id,
            name: league.name,
          },
        ],
        position,
        isPositionLocked,
      })
    }
  
    return Array.from(grouped.values())
  }