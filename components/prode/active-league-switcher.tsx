"use client"

import { useState } from "react"
import { ChevronDown, Check, X } from "lucide-react"
import { useLeague } from "@/context/league-context"
import { cn } from "@/lib/utils"

export function LeagueSwitcherButton() {
  const { leagues, activeLeague, setActiveLeagueId } = useLeague()
  const [open, setOpen] = useState(false)

  if (leagues.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium"
      >
        <span className="max-w-[140px] truncate">{activeLeague?.league.name ?? "Elegir liga"}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
          />
          <div className="relative mx-auto flex max-h-[70vh] w-full max-w-md flex-col rounded-t-3xl border-t border-border bg-card animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-heading text-lg font-bold uppercase">Elegir Liga</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              {leagues.map((userLeague) => {
                const selected = userLeague.league.id === activeLeague?.league.id
                return (
                  <button
                    key={userLeague.league.id}
                    type="button"
                    onClick={() => {
                      setActiveLeagueId(userLeague.league.id)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-secondary",
                      selected && "bg-primary/10",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{userLeague.league.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {userLeague.membersCount} jugadores · {userLeague.role === "owner" ? "Admin" : "Miembro"}
                      </p>
                    </div>
                    {selected && <Check className="size-5 shrink-0 text-primary" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}