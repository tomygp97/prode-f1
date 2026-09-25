import { DriverAvatar } from "@/components/prode/driver-avatar"
import { Driver, findTeam, Team } from "@/lib/f1-data"
import { MatchState } from "@/lib/results/buildResultComparison"
import { displayColour } from "@/lib/utils"
import { MatchBadge } from "./match-badge"

export function ResultDriverLine({
  drivers,
  teams,
  driverId,
  position,
  state = null,
}: {
  drivers: Driver[]
  teams: Team[]
  driverId: string | null
  position?: string
  state?: MatchState | null
}) {
  const driver = driverId ? drivers.find((d) => d.id === driverId) : undefined
  const team = driver ? findTeam(teams, driver.teamId) : undefined
  const teamColour = team?.colour ?? "#666"

  return (
    <div className="flex items-center gap-2 py-1.5">
      {position && (
        <span className="w-6 shrink-0 text-center font-heading text-sm font-bold text-muted-foreground">
          {position}
        </span>
      )}
      {driver ? (
        <>
          <DriverAvatar driver={driver} size="sm" colour={teamColour} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{driver.acronym}</p>
            <p className="truncate text-[11px]" style={{ color: displayColour(teamColour) }}>
              {team?.name ?? "—"}
            </p>
          </div>
        </>
      ) : (
        <span className="flex-1 text-sm text-muted-foreground">—</span>
      )}
      <MatchBadge state={state} />
    </div>
  )
}
