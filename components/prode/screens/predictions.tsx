"use client"

import { useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import {
  Lock,
  Trophy,
  ListOrdered,
  ShieldAlert,
  CarFront,
  Check,
  Minus,
  Plus,
  Users,
} from "lucide-react"
import { DriverPicker, DriverSlot } from "@/components/prode/driver-picker"
import { cn } from "@/lib/utils"
import { useNextGP } from "@/hooks/use-next-gp"
import { useDrivers } from "@/hooks/use-drivers"
import { useTeams } from "@/hooks/use-teams"
import { useRaceEntries } from "@/hooks/use-race-entries"
import Link from "next/link"
import { useLeague } from "@/context/league-context"
import { TrackedDriverPrediction } from "@/components/prode/screens/tracked-driver-prediction"
import { buildTrackedDriverItems } from "@/lib/predictions/buildTrackedDriverItems"
import { useMyPredictions } from "@/hooks/use-my-predictions"
import { SectionCard } from "../section-card"
import { usePredictionForm } from "@/hooks/use-prediction-form"
import { ScoringSummary } from "@/components/prediction/scoring-summary"
import { useSavePrediction } from "@/hooks/use-save-prediction"

export function Predictions() {
  const { nextGP, isLoading: nextGPLoading, error: nextGPError } = useNextGP()
  const { token } = useAuth()

  const { leagues, isLoading: leaguesLoading, error: leaguesError } = useLeague()
  // Selector: solo la grilla del GP que se predice (el back rechaza pilotos fuera de ella)
  const { drivers, teams, isLoading: gridLoading, error: gridError } = useRaceEntries(nextGP?.id)
  // Plantel completo: para el piloto seguido de cada liga, aunque no corra este GP
  const { drivers: rosterDrivers, isLoading: driversLoading, error: driversError } = useDrivers()
  const { teams: rosterTeams, isLoading: teamsLoading, error: teamsError } = useTeams()
  const { predictions, isLoading: predictionsLoading, error: predictionsError } = useMyPredictions(leagues, nextGP?.id, token)

  const isLoading =
    nextGPLoading || gridLoading || driversLoading || teamsLoading || leaguesLoading || predictionsLoading
  const fetchError = nextGPError ?? gridError ?? driversError ?? teamsError ?? leaguesError ?? predictionsError

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
  } = usePredictionForm({leagues, predictions})

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
    [
      leagues,
      trackedLookup,
      gridOrder,
      manualTrackedDriverPositions,
    ],
  )

  const { savePrediction, isSaving, saved, error: saveError } = useSavePrediction({
  token,
  raceId: nextGP?.id,
    leagues,
    predictedOrder: gridOrder,
    pole: gridPole,
    safetyCar,
    dnf,
    trackedDriverItems
  })

  if (isLoading) {
    return <div className="px-4 py-5 text-muted-foreground">Cargando...</div>
  }
  if (fetchError) return <div className="px-4 py-5 text-primary">{fetchError}</div>

  if (!nextGP) {
    return <div className="px-4 py-5 text-muted-foreground">No hay próximo GP</div>
  }

  // Sin ligas no hay dónde guardar la predicción (se guarda por liga)
  if (leagues.length === 0) {
    return (
      <div className="px-4 py-5">
        <section className="rounded-2xl border border-border bg-card p-5 text-center">
          <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Users className="size-5" />
          </span>
          <p className="mt-2 font-heading text-base font-bold uppercase">Todavía no estás en una liga</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Para predecir {nextGP.flag} {nextGP.name} creá una liga o unite con el código de un amigo.
          </p>
          <Link
            href="/leagues"
            className="mt-4 inline-block rounded-xl bg-primary px-4 py-2.5 font-heading text-sm font-bold uppercase text-primary-foreground"
          >
            Ir a Ligas
          </Link>
        </section>
      </div>
    )
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
      <ScoringSummary
        trackedDriverAcronyms={trackedDriverItems.map((item) => item.driver.acronym)}
        maxPredictionSlots={maxPredictionSlots}
      />

      <button
        type="button"
        onClick={savePrediction}
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
      {saveError && (
        <p className="-mt-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5 text-center text-sm text-primary">
          {saveError}
        </p>
      )}

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
