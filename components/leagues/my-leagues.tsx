"use client"

import { useState } from "react"
import { ChevronDown, Crown, LogOut, Users } from "lucide-react"
import { useLeague } from "@/context/league-context"
import { UserLeague } from "@/lib/api/leagues"
import { Driver } from "@/lib/f1-data"
import { cn } from "@/lib/utils"
import { InviteShare } from "./invite-share"
import { LeaveLeagueDialog } from "./leave-league-dialog"

export function MyLeagues({ drivers }: { drivers: Driver[] }) {
  const { leagues, activeLeagueId, setActiveLeagueId, reload } = useLeague()
  const [openInviteId, setOpenInviteId] = useState<string | null>(null)
  const [leaving, setLeaving] = useState<UserLeague | null>(null)

  if (leagues.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
        Todavía no estás en ninguna liga. Creá una o unite con un código.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {leagues.map((userLeague) => {
        const { league } = userLeague
        const isActive = league.id === activeLeagueId
        const inviteOpen = openInviteId === league.id
        const tracked = league.trackedDriverId
          ? drivers.find((driver) => driver.id === league.trackedDriverId)
          : undefined

        return (
          <section
            key={league.id}
            className={cn(
              "space-y-3 rounded-2xl border bg-card p-4",
              isActive ? "border-primary/60" : "border-border",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-heading text-lg font-bold uppercase leading-tight">{league.name}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3" /> {userLeague.membersCount} jugadores
                  </span>
                  {userLeague.role === "admin" && (
                    <span className="inline-flex items-center gap-1 text-arg">
                      <Crown className="size-3" /> Admin
                    </span>
                  )}
                  <span>· Top {league.predictionSlots}</span>
                  {tracked && <span>· Sigue a {tracked.acronym}</span>}
                </p>
              </div>
              {isActive ? (
                <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                  Activa
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveLeagueId(league.id)}
                  className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs font-medium hover:bg-secondary"
                >
                  Usar
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpenInviteId(inviteOpen ? null : league.id)}
                className="flex flex-1 items-center justify-between rounded-xl bg-secondary px-3 py-2 text-sm font-medium"
              >
                Invitar amigos
                <ChevronDown className={cn("size-4 transition-transform", inviteOpen && "rotate-180")} />
              </button>
              <button
                type="button"
                onClick={() => setLeaving(userLeague)}
                className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="size-4" /> Salir
              </button>
            </div>

            {inviteOpen && <InviteShare leagueName={league.name} inviteCode={userLeague.inviteCode} />}
          </section>
        )
      })}

      {leaving && (
        <LeaveLeagueDialog
          userLeague={leaving}
          onClose={() => setLeaving(null)}
          onLeft={() => {
            setLeaving(null)
            reload()
          }}
        />
      )}
    </div>
  )
}
