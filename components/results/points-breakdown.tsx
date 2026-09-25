import { cn } from "@/lib/utils"
import { PredictionScore } from "@/lib/api/predictions"
import { ResultComparison } from "@/lib/results/buildResultComparison"

type BreakdownRow = { category: string; detail: string; points: number }

function yesNo(value: boolean | null) {
  if (value === null) return "—"
  return value ? "Sí" : "No"
}

// Puntos por categoría tal cual los calculó el back; el detalle sale de la comparación
export function PointsBreakdown({
  score,
  comparison,
  acronymOf,
}: {
  score: PredictionScore
  comparison: ResultComparison
  acronymOf: (driverId: string | null) => string
}) {
  const { pointsBreakdown: points } = score
  const { counts, pole, safetyCar, dnf, trackedDriver } = comparison

  const rows: BreakdownRow[] = [
    {
      category: `Top ${comparison.order.length}`,
      detail: `${counts.exact} exactas · ${counts.near} a una posición`,
      points: points.positions,
    },
    {
      category: "Pole Position",
      detail:
        pole.state === "exact"
          ? `${acronymOf(pole.actual)} — correcto`
          : `Elegiste ${acronymOf(pole.predicted)} · fue ${acronymOf(pole.actual)}`,
      points: points.pole,
    },
    {
      category: "Safety Car",
      detail: `Dijiste ${yesNo(safetyCar.predicted)} · fue ${yesNo(safetyCar.actual)}`,
      points: points.safetyCar,
    },
    {
      category: "DNF",
      detail: `Dijiste ${dnf.predicted ?? "—"} · fueron ${dnf.actual}`,
      points: points.dnfCount,
    },
  ]

  if (trackedDriver) {
    rows.push({
      category: acronymOf(trackedDriver.driverId),
      detail: `Dijiste P${trackedDriver.predicted ?? "—"} · terminó ${
        trackedDriver.actual ? `P${trackedDriver.actual}` : "sin posición"
      }`,
      points: points.trackedDriver,
    })
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-3 font-heading text-base font-bold uppercase">Desglose de Puntos</h2>
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.category} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold">{row.category}</p>
              <p className="truncate text-xs text-muted-foreground">{row.detail}</p>
            </div>
            <span
              className={cn(
                "shrink-0 font-heading text-lg font-bold",
                row.points > 0 ? "text-arg" : "text-muted-foreground",
              )}
            >
              +{row.points}
            </span>
          </li>
        ))}
        <li className="flex items-center justify-between gap-3 pt-3">
          <p className="font-heading text-base font-bold uppercase">Total Fecha</p>
          <span className="font-heading text-2xl font-bold text-primary">+{score.totalPoints}</span>
        </li>
      </ul>
    </section>
  )
}
