import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { MatchState } from "@/lib/results/buildResultComparison"

// ✓ exacto · ±1 cerca · ✗ fallo (visual; los puntos vienen del back)
export function MatchBadge({ state, className }: { state: MatchState | null; className?: string }) {
  if (!state) return null

  if (state === "near") {
    return (
      <span
        className={cn(
          "shrink-0 rounded bg-secondary px-1.5 text-[10px] font-bold text-foreground",
          className,
        )}
        title="A una posición"
      >
        ±1
      </span>
    )
  }

  return state === "exact" ? (
    <Check className={cn("size-4 shrink-0 text-arg", className)} aria-label="Acierto" />
  ) : (
    <X className={cn("size-4 shrink-0 text-primary", className)} aria-label="Fallo" />
  )
}
