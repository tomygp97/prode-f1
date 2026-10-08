import { Prediction } from "@/lib/api/predictions"
import { Driver, Team } from "@/lib/f1-data"
import { ResultDriverLine } from "@/components/results/result-driver-line"

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 mt-3 text-[10px] uppercase tracking-wider text-muted-foreground first:mt-0">{children}</p>
  )
}

function Factor({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-2 py-2 text-center">
      <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-heading text-base font-bold">{value}</p>
    </div>
  )
}

/**
 * Predicción de un miembro de la liga en solo lectura, para la carrera en curso:
 * todavía no hay resultado, así que no se compara ni se puntúa.
 */
export function MemberPredictionCard({
  prediction,
  drivers,
  teams,
  trackedDriverId,
}: {
  prediction: Prediction
  drivers: Driver[]
  teams: Team[]
  trackedDriverId: string | null
}) {
  const trackedDriver = trackedDriverId ? drivers.find((driver) => driver.id === trackedDriverId) : undefined

  return (
    <div>
      <Label>Pole</Label>
      <ResultDriverLine drivers={drivers} teams={teams} driverId={prediction.predictedPoleDriverId} />

      <Label>Top {prediction.predictedOrder.length}</Label>
      {prediction.predictedOrder.map((driverId, i) => (
        <ResultDriverLine key={i} drivers={drivers} teams={teams} driverId={driverId} position={`P${i + 1}`} />
      ))}

      <div className={trackedDriverId ? "mt-3 grid grid-cols-3 gap-2" : "mt-3 grid grid-cols-2 gap-2"}>
        <Factor label="Safety Car" value={prediction.safetyCar ? "Sí" : "No"} />
        <Factor label="DNF" value={String(prediction.dnfCount)} />
        {trackedDriverId && (
          <Factor
            label={trackedDriver?.acronym ?? "Seguido"}
            value={prediction.trackedDriverPosition === null ? "—" : `P${prediction.trackedDriverPosition}`}
          />
        )}
      </div>
    </div>
  )
}
