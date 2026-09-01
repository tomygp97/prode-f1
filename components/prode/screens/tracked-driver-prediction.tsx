"use client"

import { cn } from "@/lib/utils"
import { TrackedDriverItem } from "@/lib/predictions/buildTrackedDriverItems";
import { DriverAvatar } from "../driver-avatar";


interface TrackedDriverPredictionProps {
    items: TrackedDriverItem[]
    onPositionChange: (leagueId: string, position: number) => void
  }

export const TrackedDriverPrediction = ({ items, onPositionChange }: TrackedDriverPredictionProps) => {
    return (
        <section className="space-y-3">
          {items.map((item) => (
            <section
              key={item.driver.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <DriverAvatar
                    driver={item.driver}
                    size="sm"
                    colour={item.team?.colour ?? "#666"}
                  />
    
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {item.driver.name}
                    </p>
    
                    <p
                      className="truncate text-xs"
                      style={{
                        color: item.team?.colour ?? "#666",
                      }}
                    >
                      {item.team?.name ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
    
              <div className="px-4 pb-4">
                <p className="mb-2 text-sm font-medium">
                  ¿En qué posición terminará {item.driver.name}?
                </p>
    
                {item.isPositionLocked ? (
                  <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-3">
                    <p className="text-sm font-medium text-primary">
                      P{item.position}
                    </p>
    
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.driver.name} ya está seleccionado en P{item.position}{" "}
                      en tu predicción.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const position = i + 1
    
                      return (
                        <button
                          key={position}
                          type="button"
                          onClick={() =>
                            onPositionChange(item.driver.id, position)
                          }
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-lg border font-heading text-sm font-bold transition-colors",
                            item.position === position
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground hover:bg-secondary",
                          )}
                        >
                          P{position}
                        </button>
                      )
                    })}
                  </div>
                )}
    
                <div className="mt-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Se aplica a
                  </p>
    
                  <div className="flex flex-wrap gap-1.5">
                    {item.leagues.map((league) => (
                      <span
                        key={league.id}
                        className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {league.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </section>
      )
}