import { cn } from "@/lib/utils"
import { MatchState } from "@/lib/results/buildResultComparison"
import { MatchBadge } from "./match-badge"

// Safety Car / DNF / piloto seguido: lo que dije (grande) y lo real (chip)
export function FactorTile({
  label,
  predicted,
  actual,
  state,
}: {
  label: string
  predicted: string | null
  actual: string
  state: MatchState | null
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-xl font-bold">{predicted ?? "—"}</p>
      <div
        className={cn(
          "mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
          state === "exact" && "bg-arg/15 text-arg",
          state === "near" && "bg-secondary text-foreground",
          state === "miss" && "bg-primary/15 text-primary",
          state === null && "bg-secondary text-muted-foreground",
        )}
      >
        {state === "near" ? null : <MatchBadge state={state} className="size-3" />}
        Real: {actual}
      </div>
    </div>
  )
}
