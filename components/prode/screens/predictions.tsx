"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/context/auth-context"
import {
  Lock,
  Trophy,
  ListOrdered,
  ShieldAlert,
  CarFront,
  Info,
  Check,
  Minus,
  Plus,
} from "lucide-react"
import { DriverPicker, DriverSlot } from "@/components/prode/driver-picker"
import { scoring } from "@/lib/f1-data"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useNextGP } from "@/hooks/use-next-gp"
import { useDrivers } from "@/hooks/use-drivers"
import { useTeams } from "@/hooks/use-teams"
import { useLeague } from "@/context/league-context"
import { TrackedDriverPrediction } from "@/components/prode/screens/tracked-driver-prediction"
import { buildTrackedDriverItems } from "@/lib/predictions/buildTrackedDriverItems"
import { submitPrediction } from "@/lib/api/predictions"
import { buildPredictionRequest } from "@/lib/predictions/buildPredictionRequest"

type PickerState =
  | { kind: "pole" }
  | { kind: "predictedOrder"; index: number }
  | null

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Trophy
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-4" />
        </span>
        <div>
          <h2 className="font-heading text-base font-bold uppercase leading-none">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

export function Predictions() {
  const router = useRouter()
  const { nextGP } = useNextGP()
  const { token } = useAuth()

  const { leagues, isLoading: leaguesLoading, error: leaguesError } = useLeague()
  const { drivers, isLoading: driversLoading, error: driversError } = useDrivers()
  const { teams, isLoading: teamsLoading, error: teamsError } = useTeams()

  const isLoading = driversLoading || teamsLoading || leaguesLoading
  const fetchError = driversError ?? teamsError ?? leaguesError

  const [pole, setPole] = useState<string | undefined>();
  const [predictedOrder, setPredictedOrder] = useState<(string | undefined)[]>([])
  const [safetyCar, setSafetyCar] = useState<boolean | null>(null)
  const [dnf, setDnf] = useState(2)
  const [picker, setPicker] = useState<PickerState>(null)
  const [saved, setSaved] = useState(false) //! Verificar
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [manualTrackedDriverPositions, setManualTrackedDriverPositions] = useState<Record<string, number>>({})

  const maxPredictionSlots = leagues.length
    ? Math.max(...leagues.map((userLeague) => userLeague.league.predictionSlots))
    : 0

    useEffect(() => {
      if (maxPredictionSlots === 0) return
    
      setPredictedOrder((prev) => {
        if (prev.length === maxPredictionSlots) return prev
    
        return Array.from(
          { length: maxPredictionSlots },
          (_, index) => prev[index],
        )
      })
    }, [maxPredictionSlots])
  
  const trackedDriverItems = useMemo(() =>
    buildTrackedDriverItems({
      leagues,
      drivers,
      teams,
      predictedOrder,
      manualPositions: manualTrackedDriverPositions,
    }),
    [
      leagues,
      drivers,
      teams,
      predictedOrder,
      manualTrackedDriverPositions,
    ],
  )

  if (isLoading) {
    return <div className="px-4 py-5 text-muted-foreground">Cargando...</div>
  }
  if (fetchError) return <div>{fetchError}</div>
  
  if (!nextGP) {
    return <div className="px-4 py-5 text-muted-foreground">No hay próximo GP</div>
  }

  function handleSelect(id: string) {
    if (!picker) return
  
    if (picker.kind === "pole") {
      setPole(id)
      return
    }
  
    if (picker.kind === "predictedOrder") {
      setPredictedOrder((prev) =>
        prev.map((value, index) =>
          index === picker.index ? id : value,
        ),
      )
    }
  }

  const handleTrackedDriverPositionChange = (
    driverId: string,
    position: number,
  ) => {
    setManualTrackedDriverPositions((prev) => ({
      ...prev,
      [driverId]: position,
    }))
  }

  async function handleSubmit() {
    if (!token || !nextGP) {
      return
    }

    try {
      setIsSaving(true)
      setSubmitError(null)
      setSaved(false)
      const requests = leagues.map((userLeague) => {
        const league = userLeague.league

        const body = buildPredictionRequest({
          league, predictedOrder, pole, safetyCar, dnf, trackedDriverItems
        })

        if (!body) {
          throw new Error(`La predicción para la liga "${league.name}" esta incompleta`)
        }

        return submitPrediction(token, league.id, nextGP.id, body)
      })

      await Promise.all(requests)
      setSaved(true)
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "No se pudieron guardar las predicciones",
      )
    } finally {
      setIsSaving(false)
    }
  }

  function pickerProps() {
    if (!picker) {
      return {
        title: "",
        value: undefined,
        exclude: [] as string[],
      }
    }
  
    if (picker.kind === "pole") {
      return {
        title: "Elegí la Pole",
        value: pole,
        exclude: [],
      }
    }
  
    if (picker.kind === "predictedOrder") {
      const exclude = predictedOrder.filter(
        (driverId, index) =>
          driverId && index !== picker.index,
      ) as string[]
  
      return {
        title: `Elegí P${picker.index + 1}`,
        value: predictedOrder[picker.index],
        exclude,
      }
    }
  
    return {
      title: "",
      value: undefined,
      exclude: [],
    }
  }

  const pp = pickerProps()

  return (
    <div className="space-y-5 px-4 py-5">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase leading-tight">
          Predicciones {nextGP.flag} {nextGP.name}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          Las predicciones se bloquean al comenzar la clasificación.
        </p>
      </div>

      {/* Pole */}
      <SectionCard icon={Trophy} title="Pole Position" subtitle="¿Quién larga primero el domingo?">
        <DriverSlot
          drivers={drivers}
          teams={teams}
          driverId={pole}
          placeholder="Seleccionar piloto"
          onClick={() => setPicker({ kind: "pole" })}
        />
      </SectionCard>

      {/* Orden de Carrera */}
      <SectionCard icon={ListOrdered} title="Orden de Carrera" subtitle="No se pueden repetir pilotos.">
        <div className="space-y-2">
          {Array.from({ length: maxPredictionSlots }).map((_, i) => (
            <DriverSlot 
              key={i}
              drivers={drivers}
              teams={teams}
              position={`P${i+1}`}
              driverId={predictedOrder[i]}
              placeholder={`Seleccionar P${i+1}`}
              onClick={() => setPicker({
                kind: "predictedOrder",
                index: i,
              })}
            />
          ))}
        </div>
      </SectionCard>

      {/* Safety Car */}
      <SectionCard icon={ShieldAlert} title="Safety Car" subtitle="¿Habrá Safety Car durante la carrera?">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Sí", val: true },
            { label: "No", val: false },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => setSafetyCar(o.val)}
              className={cn(
                "rounded-xl border py-3 font-heading text-lg font-bold uppercase transition-colors",
                safetyCar === o.val
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-secondary",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* DNF */}
      <SectionCard icon={CarFront} title="DNF" subtitle="¿Cuántos pilotos abandonarán la carrera?">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setDnf((v) => Math.max(0, v - 1))}
            className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
            disabled={dnf === 0}
            aria-label="Restar"
          >
            <Minus className="size-5" />
          </button>
          <div className="flex flex-col items-center">
            <span className="font-heading text-4xl font-bold tabular-nums">{dnf}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              abandonos
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDnf((v) => Math.min(10, v + 1))}
            className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
            disabled={dnf === 10}
            aria-label="Sumar"
          >
            <Plus className="size-5" />
          </button>
        </div>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 11 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setDnf(i)}
              aria-label={`${i} abandonos`}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= dnf ? "bg-primary" : "bg-secondary",
              )}
            />
          ))}
        </div>
      </SectionCard>

      {/* Tracked Driver */}
      {trackedDriverItems.length > 0 && (
        <TrackedDriverPrediction
          items={trackedDriverItems}
          onPositionChange={handleTrackedDriverPositionChange}
        />
      )}

      {/* Scoring summary */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Info className="size-4 text-muted-foreground" />
          <h2 className="font-heading text-base font-bold uppercase">Resumen de Puntajes</h2>
        </div>
        <ul className="divide-y divide-border">
          {scoring.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="shrink-0 rounded-md bg-primary/15 px-2 py-0.5 font-heading text-sm font-bold text-primary">
                +{s.points}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSaving}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-heading text-base font-bold uppercase tracking-wide transition-all active:scale-[0.98]",
          saved ? "bg-arg text-arg-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        {saved ? (
          <>
            <Check className="size-5" /> Predicción Guardada
          </>
        ) : (
          "Guardar Predicción"
        )}
      </button>

      <DriverPicker
        drivers={drivers}
        teams={teams}
        open={picker !== null}
        title={pp.title}
        value={pp.value}
        exclude={pp.exclude}
        onClose={() => setPicker(null)}
        onSelect={handleSelect}
      />
    </div>
  )
}
