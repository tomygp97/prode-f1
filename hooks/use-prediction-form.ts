"use client"

import { useEffect, useState } from "react"

import { Prediction } from "@/lib/api/predictions"
import { UserLeague } from "@/lib/api/leagues"

type PickerState =
  | { kind: "pole" }
  | { kind: "predictedOrder"; index: number }
  | null

type UsePredictionFormParams = {
  leagues: UserLeague[]
  predictions: Record<string, Prediction | null>
}

export function usePredictionForm({
  leagues,
  predictions,
}: UsePredictionFormParams) {
  const [pole, setPole] = useState<string | undefined>()
  const [predictedOrder, setPredictedOrder] = useState<
    (string | undefined)[]
  >([])
  const [safetyCar, setSafetyCar] = useState<boolean | null>(null)
  const [dnf, setDnf] = useState(2)

  const [picker, setPicker] = useState<PickerState>(null)

  const [manualTrackedDriverPositions, setManualTrackedDriverPositions] =
    useState<Record<string, number>>({})

  const maxPredictionSlots = leagues.length
    ? Math.max(
        ...leagues.map(
          (userLeague) => userLeague.league.predictionSlots,
        ),
      )
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

  useEffect(() => {
    if (leagues.length === 0 || maxPredictionSlots === 0) return
    if (Object.keys(predictions).length === 0) return

    const leaguesWithPrediction = leagues
      .map((userLeague) => ({
        userLeague,
        prediction: predictions[userLeague.league.id],
      }))
      .filter(
        ({ prediction }) =>
          prediction !== null && prediction !== undefined,
      )

    if (leaguesWithPrediction.length === 0) return

    const basePrediction = leaguesWithPrediction.reduce(
      (best, current) => {
        if (!best) return current

        return current.userLeague.league.predictionSlots >
          best.userLeague.league.predictionSlots
          ? current
          : best
      },
      null as (typeof leaguesWithPrediction)[number] | null,
    )

    if (!basePrediction) return

    const prediction = basePrediction.prediction
    if (!prediction) return

    setPole(prediction.predictedPoleDriverId)

    setPredictedOrder(
      Array.from(
        { length: maxPredictionSlots },
        (_, index) => prediction.predictedOrder[index],
      ),
    )

    setSafetyCar(prediction.safetyCar)
    setDnf(prediction.dnfCount)

    const trackedPositions: Record<string, number> = {}

    for (const userLeague of leagues) {
      const trackedDriverId = userLeague.league.trackedDriverId

      if (!trackedDriverId) continue

      const leaguePrediction = predictions[userLeague.league.id]

      if (!leaguePrediction) continue

      if (leaguePrediction.trackedDriverPosition === null) {
        continue
      }

      trackedPositions[trackedDriverId] =
        leaguePrediction.trackedDriverPosition
    }

    setManualTrackedDriverPositions(trackedPositions)
  }, [leagues, predictions, maxPredictionSlots])

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

  function handleTrackedDriverPositionChange(
    driverId: string,
    position: number,
  ) {
    setManualTrackedDriverPositions((prev) => ({
      ...prev,
      [driverId]: position,
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
    handleTrackedDriverPositionChange,
  }
}