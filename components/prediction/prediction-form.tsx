"use client"

import { useEffect, useMemo, useRef } from "react"
import { useAuth } from "@/context/auth-context"
import { useLeague } from "@/context/league-context"
import {
  Lock,
  Trophy,
  ListOrdered,
  ShieldAlert,
  CarFront,
  Check,
  Minus,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { DriverPicker, DriverSlot } from "@/components/prode/driver-picker"
import { TrackedDriverPrediction } from "@/components/prode/screens/tracked-driver-prediction"
import { SectionCard } from "@/components/prode/section-card"
import { ScoringSummary } from "@/components/prediction/scoring-summary"
import { cn } from "@/lib/utils"
import { RaceFromApi, toGrandPrix } from "@/lib/api/races"
import { buildTrackedDriverItems } from "@/lib/predictions/buildTrackedDriverItems"
import { useDrivers } from "@/hooks/use-drivers"
import { useTeams } from "@/hooks/use-teams"
import { useRaceEntries } from "@/hooks/use-race-entries"
import { useMyPredictions } from "@/hooks/use-my-predictions"
import { usePredictionForm } from "@/hooks/use-prediction-form"
import { useSavePrediction } from "@/hooks/use-save-prediction"

/**
 * Formulario de predicción de una carrera. Con `readOnly` (predicciones cerradas) muestra la
 * predicción guardada sin poder cambiarla y sin botón de guardar; `notice` explica por qué.
 */
export function PredictionForm({
  race,
  readOnly = false,
  notice,
}: {
  race: RaceFromApi
  readOnly?: boolean
  notice?: string
}) {
  const gp = toGrandPrix(race)
  const { token } = useAuth()
  const { leagues } = useLeague()

  // Selector: solo la grilla de esta carrera (el back rechaza pilotos fuera de ella)
  const { drivers, teams, isLoading: gridLoading, error: gridError } = useRaceEntries(race.id)
  // Plantel completo: para el piloto seguido de cada liga, aunque no corra este GP
  const { drivers: rosterDrivers, isLoading: driversLoading, error: driversError } = useDrivers()
  const { teams: rosterTeams, isLoading: teamsLoading, error: teamsError } = useTeams()
  const { predictions, isLoading: predictionsLoading, error: predictionsError } = useMyPredictions(leagues, race.id, token)

  const isLoading = gridLoading || driversLoading || teamsLoading || predictionsLoading
  const fetchError = gridError ?? driversError ?? teamsError ?? predictionsError

  // El piloto seguido se busca primero en la grilla (equipo de esta carrera) y si no, en el plantel
  const trackedLookup = useMemo(() => {
    const gridIds = new Set(drivers.map((driver) => driver.id))
    const gridTeamIds = new Set(teams.map((team) => team.id))
    return {
      drivers: [...drivers, ...rosterDrivers.filter((driver) => !gridIds.has(driver.id))],
      teams: [...teams, ...rosterTeams.filter((team) => !gridTeamIds.has(team.id))],
    }
  }, [drivers, teams, rosterDrivers, rosterTeams])

  const {
    pole,
    predictedOrder,
    safetyCar,
    dnf,
    picker,
    setPicker,
    manualTrackedDriverPositions,
    maxPredictionSlots,
    setSafetyCar,
    setDnf,
    handleSelect,
    handleTrackedDriverPositionChange,
  } = usePredictionForm({ raceId: race.id, leagues, predictions })

  // Una predicción guardada antes puede tener pilotos que ya no corren esta fecha (reemplazos):
  // en pantalla se ven vacíos, así que tampoco se mandan (el back los rechazaría)
  const { gridOrder, gridPole } = useMemo(() => {
    const gridIds = new Set(drivers.map((driver) => driver.id))
    const onGrid = (driverId: string | undefined) => (driverId && gridIds.has(driverId) ? driverId : undefined)
    return { gridOrder: predictedOrder.map(onGrid), gridPole: onGrid(pole) }
  }, [drivers, predictedOrder, pole])

  const trackedDriverItems = useMemo(() =>
    buildTrackedDriverItems({
      leagues,
      drivers: trackedLookup.drivers,
      teams: trackedLookup.teams,
      predictedOrder: gridOrder,
      manualPositions: manualTrackedDriverPositions,
    }),
    [leagues, trackedLookup, gridOrder, manualTrackedDriverPositions],
  )

  const { savePrediction, isSaving, saved, error: saveError } = useSavePrediction({
    token,
    raceId: race.id,
    leagues,
    predictedOrder: gridOrder,
    pole: gridPole,
    safetyCar,
    dnf,
    trackedDriverItems,
  })

  if (isLoading) {
    return <div className="text-muted-foreground">Cargando...</div>
  }
  if (fetchError) return <div className="text-primary">{fetchError}</div>

  const hasSavedPrediction = Object.values(predictions).some((prediction) => prediction !== null)

  const header = (
    <div>
      <h1 className="font-heading text-2xl font-bold uppercase leading-tight">
        {readOnly ? "Tu predicción" : "Predicciones"} {gp.flag} {gp.name}
      </h1>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3.5" />
        {readOnly ? "Predicciones cerradas: empezó la clasificación." : "Las predicciones se bloquean al comenzar la clasificación."}
      </p>
    </div>
  )

  const noticeBox = notice && (
    <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2.5 text-sm text-amber-400">{notice}</p>
  )

  // Cerrada y sin nada guardado: no hay nada que mostrar en el formulario
  if (readOnly && !hasSavedPrediction) {
    return (
      <div className="space-y-5">
        {header}
        {noticeBox}
        <section className="rounded-2xl border border-border bg-card p-5 text-center text-sm text-muted-foreground">
          No cargaste predicción para esta fecha.
        </section>
      </div>
    )
  }

  function pickerProps() {
    if (picker?.kind === "pole") {
      return { title: "Elegí la Pole", value: pole, exclude: [] as string[] }
    }
    if (picker?.kind === "predictedOrder") {
      const exclude = predictedOrder.filter(
        (driverId, index) => driverId && index !== picker.index,
      ) as string[]
      return { title: `Elegí P${picker.index + 1}`, value: predictedOrder[picker.index], exclude }
    }
    return { title: "", value: undefined, exclude: [] as string[] }
  }

  const pp = pickerProps()

  return (
    <div className="space-y-5">
      {header}
      {noticeBox}

      {/* Pole */}
      <SectionCard icon={Trophy} title="Pole Position" subtitle="¿Quién larga primero el domingo?">
        <DriverSlot
          drivers={drivers}
          teams={teams}
          driverId={pole}
          placeholder="Seleccionar piloto"
          disabled={readOnly}
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
              position={`P${i + 1}`}
              driverId={predictedOrder[i]}
              placeholder={`Seleccionar P${i + 1}`}
              disabled={readOnly}
              onClick={() => setPicker({ kind: "predictedOrder", index: i })}
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
              disabled={readOnly}
              onClick={() => setSafetyCar(o.val)}
              className={cn(
                "rounded-xl border py-3 font-heading text-lg font-bold uppercase transition-colors disabled:cursor-not-allowed",
                safetyCar === o.val
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-secondary disabled:hover:bg-background",
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
            disabled={readOnly || dnf === 0}
            aria-label="Restar"
          >
            <Minus className="size-5" />
          </button>
          <div className="flex flex-col items-center">
            <span className="font-heading text-4xl font-bold tabular-nums">{dnf}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">abandonos</span>
          </div>
          <button
            type="button"
            onClick={() => setDnf((v) => Math.min(10, v + 1))}
            className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
            disabled={readOnly || dnf === 10}
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
              disabled={readOnly}
              onClick={() => setDnf(i)}
              aria-label={`${i} abandonos`}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors disabled:cursor-not-allowed",
                i < dnf ? "bg-primary" : "bg-secondary",
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
          maxPosition={drivers.length}
          disabled={readOnly}
        />
      )}

      {/* Scoring summary */}
      <ScoringSummary
        trackedDriverAcronyms={trackedDriverItems.map((item) => item.driver.acronym)}
        maxPredictionSlots={maxPredictionSlots}
      />

      {!readOnly && (
        <>
          <button
            type="button"
            onClick={savePrediction}
            disabled={isSaving}
            aria-busy={isSaving}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-heading text-base font-bold uppercase tracking-wide transition-all active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 disabled:active:scale-100",
              saved ? "bg-arg text-arg-foreground" : "bg-primary text-primary-foreground",
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Guardando…
              </>
            ) : saved ? (
              <>
                <Check className="size-5" /> Predicción Guardada
              </>
            ) : (
              "Guardar Predicción"
            )}
          </button>
          {saveError && <SaveErrorAlert message={saveError} />}

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
        </>
      )}
    </div>
  )
}

// Error al guardar: se lleva a la vista para que no pase desapercibido en pantallas chicas
function SaveErrorAlert({ message }: { message: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [message])

  return (
    <div
      ref={ref}
      role="alert"
      className="-mt-2 flex items-start gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5 text-sm text-primary"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  )
}
