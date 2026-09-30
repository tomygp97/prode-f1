import { Info } from "lucide-react"
import { SCORING_POINTS as P } from "@/lib/scoring"

type ScoringRow = { label: string; points: number }

// Tabla de puntos real (los mismos valores con los que calcula el back)
export function ScoringSummary({
  trackedDriverAcronyms = [],
  maxPredictionSlots,
}: {
  /** Pilotos seguidos por tus ligas; si no hay ninguno, no se muestran esas filas. */
  trackedDriverAcronyms?: string[]
  maxPredictionSlots?: number
}) {
  const topLabel = maxPredictionSlots ? `Top ${maxPredictionSlots}` : "Orden"
  const trackedName = trackedDriverAcronyms.join(" / ")

  const rows: ScoringRow[] = [
    { label: `${topLabel} — ganador exacto (P1)`, points: P.WINNER_EXACT },
    { label: `${topLabel} — posición exacta (P2 en adelante)`, points: P.POSITION_EXACT },
    { label: `${topLabel} — a una posición de diferencia`, points: P.POSITION_OFF_BY_ONE },
    { label: "Pole Position correcta", points: P.POLE_EXACT },
    { label: "Safety Car correcto", points: P.SAFETY_CAR_EXACT },
    { label: "DNF — cantidad exacta", points: P.DNF_EXACT },
    { label: "DNF — a uno de diferencia", points: P.DNF_OFF_BY_ONE },
  ]

  if (trackedDriverAcronyms.length > 0) {
    rows.push(
      { label: `${trackedName} — posición exacta`, points: P.TRACKED_DRIVER_EXACT },
      { label: `${trackedName} — a una posición de diferencia`, points: P.TRACKED_DRIVER_OFF_BY_ONE },
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Info className="size-4 text-muted-foreground" />
        <h2 className="font-heading text-base font-bold uppercase">Resumen de Puntajes</h2>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 py-2 text-sm">
            <span className="text-muted-foreground">{s.label}</span>
            <span className="shrink-0 rounded-md bg-primary/15 px-2 py-0.5 font-heading text-sm font-bold text-primary">
              +{s.points}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
