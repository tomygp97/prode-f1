"use client"

import { SetStateAction, useMemo, useState } from "react"

import { Prediction } from "@/lib/api/predictions"
import { UserLeague } from "@/lib/api/leagues"

type PickerState =
  | { kind: "pole" }
  | { kind: "predictedOrder"; index: number }
  | null

type UsePredictionFormParams = {
  raceId: string | undefined
  leagues: UserLeague[]
  predictions: Record<string, Prediction | null>
}

const DEFAULT_DNF = 2

// Lo que el usuario tocó (lo que no tocó sale de la predicción guardada).
// `null` en order[i] significa "el usuario lo vació a propósito", distinto de no tener la clave.
type Edits = {
  raceId: string | undefined
  pole?: string
  order: Record<number, string | null>
  safetyCar?: boolean
  dnf?: number
  trackedPositions: Record<string, number>
}

const noEdits = (raceId: string | undefined): Edits => ({ raceId, order: {}, trackedPositions: {} })

function savedFormValues(leagues: UserLeague[], predictions: Record<string, Prediction | null>) {
  let base: { prediction: Prediction; slots: number } | null = null
  const trackedPositions: Record<string, number> = {}

  for (const { league } of leagues) {
    const prediction = predictions[league.id]
    if (!prediction) continue

    if (!base || league.predictionSlots > base.slots) {
      base = { prediction, slots: league.predictionSlots }
    }
    if (league.trackedDriverId && prediction.trackedDriverPosition !== null) {
      trackedPositions[league.trackedDriverId] = prediction.trackedDriverPosition
    }
  }

  return {
    pole: base?.prediction.predictedPoleDriverId,
    order: base?.prediction.predictedOrder ?? [],
    safetyCar: base ? base.prediction.safetyCar : null,
    dnf: base ? base.prediction.dnfCount : DEFAULT_DNF,
    trackedPositions,
  }
}

export function usePredictionForm({
  raceId,
  leagues,
  predictions,
}: UsePredictionFormParams) {
  const [storedEdits, setEdits] = useState<Edits>(() => noEdits(raceId))
  const [picker, setPicker] = useState<PickerState>(null)

  const edits = storedEdits.raceId === raceId ? storedEdits : noEdits(raceId)
  const updateEdits = (change: (current: Edits) => Partial<Edits>) =>
    setEdits((prev) => {
      const current = prev.raceId === raceId ? prev : noEdits(raceId)
      return { ...current, ...change(current) }
    })

  const saved = useMemo(() => savedFormValues(leagues, predictions), [leagues, predictions])

  const maxPredictionSlots = leagues.length
    ? Math.max(...leagues.map((userLeague) => userLeague.league.predictionSlots))
    : 0

  const pole = edits.pole ?? saved.pole
  const safetyCar = edits.safetyCar ?? saved.safetyCar
  const dnf = edits.dnf ?? saved.dnf

  // Si edits.order[index] es null (vaciado a propósito), queda undefined en vez de caer en lo guardado
  const predictedOrder: (string | undefined)[] = Array.from(
    { length: maxPredictionSlots },
    (_, index) => {
      const edited = edits.order[index]
      if (edited === null) return undefined
      return edited ?? saved.order[index]
    },
  )
  const manualTrackedDriverPositions = { ...saved.trackedPositions, ...edits.trackedPositions }

  function setSafetyCar(value: boolean) {
    updateEdits(() => ({ safetyCar: value }))
  }

  function setDnf(value: SetStateAction<number>) {
    updateEdits((current) => {
      const previous = current.dnf ?? saved.dnf
      return { dnf: typeof value === "function" ? value(previous) : value }
    })
  }

  function handleSelect(id: string) {
    if (!picker) return

    if (picker.kind === "pole") {
      updateEdits(() => ({ pole: id }))
      return
    }

    if (picker.kind === "predictedOrder") {
      const index = picker.index
      updateEdits((current) => ({ order: { ...current.order, [index]: id } }))
    }
  }

  // Vacía una posición del Orden de Carrera, sin que vuelva a mostrar lo guardado
  function handleClearOrderSlot(index: number) {
    updateEdits((current) => ({ order: { ...current.order, [index]: null } }))
  }

  function handleTrackedDriverPositionChange(
    driverId: string,
    position: number,
  ) {
    updateEdits((current) => ({
      trackedPositions: { ...current.trackedPositions, [driverId]: position },
    }))
  }

  return {
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
    handleClearOrderSlot,
    handleTrackedDriverPositionChange,
  }
}