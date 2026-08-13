"use client"

import { useEffect, useState } from "react"
import { X, Search, Check } from "lucide-react"
import { Driver, findTeam, fullName, Team } from "@/lib/f1-data"
import { DriverAvatar } from "./driver-avatar"
import { cn, displayColour } from "@/lib/utils"

export function DriverPicker({
  drivers,
  teams,
  open,
  title,
  value,
  exclude = [],
  onClose ,
  onSelect,
}: {
  drivers: Driver[]
  teams: Team[]
  open: boolean
  title: string
  value?: string
  exclude?: string[]
  onClose: () => void
  onSelect: (id: string) => void
}) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (open) setQuery("")
  }, [open])

  if (!open) return null

  const list = (drivers ?? []).filter((d) => {
    if (exclude.includes(d.id)) return false
    const q = query.toLowerCase()
    const team = findTeam(teams, d.teamId)
    return (
      fullName(d).toLowerCase().includes(q) ||
      d.acronym.toLowerCase().includes(q) ||
      (team?.name.toLowerCase().includes(q) ?? false)
    )
  })

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
      />
      <div className="relative mx-auto flex max-h-[80vh] w-full max-w-md flex-col rounded-t-3xl border-t border-border bg-card animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="font-heading text-lg font-bold uppercase">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
            aria-label="Cerrar selector"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar piloto o equipo"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {list.map((d) => {
            
            const team = findTeam(teams, d.teamId)
            const teamColour = team?.colour ?? "#666"
            const selected = value === d.id
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  onSelect(d.id)
                  onClose()
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-secondary",
                  selected && "bg-primary/10",
                )}
              >
                <DriverAvatar driver={d} colour={teamColour} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {fullName(d)}
                  </p>
                  <p className="truncate text-xs" style={{ color: displayColour(teamColour) }}>
                    {team?.name}
                  </p>
                </div>
                {selected && <Check className="size-5 text-primary" />}
              </button>
            )
          })}
          {list.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Sin resultados
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function DriverSlot({
  drivers,
  teams,
  position,
  driverId,
  placeholder,
  onClick,
}: {
  drivers: Driver[]
  teams: Team[]
  position?: string
  driverId?: string
  placeholder: string
  onClick: () => void
}) {
  const driver = driverId ? drivers.find((d) => d.id === driverId) : undefined
  const team = driver ? findTeam(teams, driver.teamId) : undefined
  const teamColour = team?.colour ?? "#666"
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
        driver
          ? "border-border bg-background hover:bg-secondary"
          : "border-dashed border-border bg-background/40 hover:bg-secondary",
      )}
    >
      {position && (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground">
          {position}
        </span>
      )}
      {driver ? (
        <>
          <DriverAvatar driver={driver} size="sm" colour={teamColour} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{fullName(driver)}</p>
            <p className="truncate text-xs" style={{ color: displayColour(teamColour) }}>
              {team?.name ?? "—"}
            </p>
          </div>
        </>
      ) : (
        <span className="text-sm text-muted-foreground">{placeholder}</span>
      )}
    </button>
  )
}
