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

const titleClass = "font-heading text-sm font-bold uppercase leading-tight"
const officialTitle = (
  <h2 className={`${titleClass} flex items-center gap-1`}>
    <Flag className="size-3.5 text-primary" /> Oficial
  </h2>
)

// Una predicción (la mía o la de otro miembro) vs. resultado oficial: pole + top N (N = predictionSlots de la liga)
export function ComparisonCard({
  comparison,
  drivers,
  teams,
  showPrediction,
  predictionTitle = "Mi Predicción",
}: {
  comparison: ResultComparison
  drivers: Driver[]
  teams: Team[]
  showPrediction: boolean
  predictionTitle?: string
}) {
  const topLabel = `Top ${comparison.order.length}`

  const officialCard = (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-3">
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

  if (!showPrediction) {
    return (
      <div className="space-y-2">
        {officialTitle}
        {officialCard}
      </div>
    )
  }

  // Los títulos van en una fila propia, arriba de las tarjetas: si el de la predicción ocupa dos
  // líneas (un nombre largo en el celular), crece la fila entera y las tarjetas siguen empezando
  // a la misma altura, así P1 queda al lado de P1. "Oficial" se alinea con la última línea.
  return (
    <div className="grid grid-cols-2 items-end gap-x-3 gap-y-2">
      <h2 className={`${titleClass} min-w-0 text-muted-foreground`}>{predictionTitle}</h2>
      {officialTitle}

      <div className="min-w-0 self-start rounded-2xl border border-border bg-card p-3">
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
      <div className="min-w-0 self-start">{officialCard}</div>
    </div>
  )
}
