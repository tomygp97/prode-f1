import { Flag } from "lucide-react"
import { Driver, Team } from "@/lib/f1-data"
import { ResultComparison } from "@/lib/results/buildResultComparison"
import { ResultDriverLine } from "./result-driver-line"

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 mt-2 text-[10px] uppercase tracking-wider text-muted-foreground first:mt-0">
      {children}
    </p>
  )
}

// Mi predicción vs. resultado oficial: pole + top N (N = predictionSlots de la liga)
export function ComparisonCard({
  comparison,
  drivers,
  teams,
  showPrediction,
}: {
  comparison: ResultComparison
  drivers: Driver[]
  teams: Team[]
  showPrediction: boolean
}) {
  const topLabel = `Top ${comparison.order.length}`

  const official = (
    <div className="rounded-2xl border border-border bg-card p-3">
      <h2 className="mb-2 flex items-center gap-1 font-heading text-sm font-bold uppercase">
        <Flag className="size-3.5 text-primary" /> Oficial
      </h2>
      <ColumnLabel>Pole</ColumnLabel>
      <ResultDriverLine drivers={drivers} teams={teams} driverId={comparison.pole.actual} />
      <ColumnLabel>{topLabel}</ColumnLabel>
      {comparison.order.map((row) => (
        <ResultDriverLine
          key={row.position}
          drivers={drivers}
          teams={teams}
          driverId={row.actualDriverId}
          position={`P${row.position}`}
        />
      ))}
    </div>
  )

  if (!showPrediction) return official

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-border bg-card p-3">
        <h2 className="mb-2 font-heading text-sm font-bold uppercase text-muted-foreground">
          Mi Predicción
        </h2>
        <ColumnLabel>Pole</ColumnLabel>
        <ResultDriverLine
          drivers={drivers}
          teams={teams}
          driverId={comparison.pole.predicted}
          state={comparison.pole.state}
        />
        <ColumnLabel>{topLabel}</ColumnLabel>
        {comparison.order.map((row) => (
          <ResultDriverLine
            key={row.position}
            drivers={drivers}
            teams={teams}
            driverId={row.predictedDriverId}
            position={`P${row.position}`}
            state={row.state}
          />
        ))}
      </div>
      {official}
    </div>
  )
}
