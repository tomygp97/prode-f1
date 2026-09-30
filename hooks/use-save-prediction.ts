"use client"

import { UserLeague } from "@/lib/api/leagues"
import { submitPrediction } from "@/lib/api/predictions"
import { buildPredictionRequest } from "@/lib/predictions/buildPredictionRequest"
import { TrackedDriverItem } from "@/lib/predictions/buildTrackedDriverItems"
import { useState } from "react"

type UseSavePredictionParams = {
    token: string | null
    raceId: string | undefined
    leagues: UserLeague[]
    predictedOrder: (string | undefined)[]
    pole: string | undefined
    safetyCar: boolean | null
    dnf: number
    trackedDriverItems: TrackedDriverItem[]
}

export function useSavePrediction({
    token,
    raceId,
    leagues,
    predictedOrder,
    pole,
    safetyCar,
    dnf,
    trackedDriverItems,
}: UseSavePredictionParams) {
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function savePrediction() {
        if (!token || !raceId) return

        try {
            setIsSaving(true)
            setSaved(false)
            setError(null)

            const requests = leagues.map((userLeague) => {
                const league = userLeague.league

                const body = buildPredictionRequest({
                    league,
                    predictedOrder,
                    pole,
                    safetyCar,
                    dnf,
                    trackedDriverItems,
                })

                if (!body) {
                    throw new Error(`Completá la predicción: faltan datos para "${league.name}" (pole, posiciones, Safety Car o piloto seguido).`)
                }

                return submitPrediction(token, league.id, raceId, body)
            })

            await Promise.all(requests)

            setSaved(true)
        } catch (err) {
            setError(savePredictionErrorMessage(err))
        } finally {
            setIsSaving(false)
        }
    }

    return {savePrediction, isSaving, saved, error}
}

// Mensajes del back → castellano (el resto se muestra tal cual)
function savePredictionErrorMessage(err: unknown): string {
    if (!(err instanceof Error)) return "No se pudo guardar la predicción"
    if (err.message === "Predictions are closed for this race") {
        return "Las predicciones de esta fecha ya cerraron (empezó la clasificación)."
    }
    if (/are not on the grid for this race/.test(err.message)) {
        return "Elegiste un piloto que no corre esta fecha. Revisá tu predicción."
    }
    return err.message
}