"use client"

import { UserLeague } from "@/lib/api/leagues"
import { submitPrediction, SubmitPredictionRequest } from "@/lib/api/predictions"
import { buildPredictionRequest } from "@/lib/predictions/buildPredictionRequest"
import { TrackedDriverItem } from "@/lib/predictions/buildTrackedDriverItems"
import { useState } from "react"

// Si el back no responde en este tiempo (base caída, servidor dormido) se corta y se avisa
const SAVE_TIMEOUT_MS = 20_000

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

type LeagueRequest = { leagueName: string; leagueId: string; body: SubmitPredictionRequest | null }

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
    // Lo último que se guardó bien: si el usuario cambia algo, deja de figurar como guardada
    const [savedSignature, setSavedSignature] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const requests: LeagueRequest[] = leagues.map(({ league }) => ({
        leagueName: league.name,
        leagueId: league.id,
        body: buildPredictionRequest({ league, predictedOrder, pole, safetyCar, dnf, trackedDriverItems }),
    }))
    const signature = JSON.stringify([raceId, requests])
    const saved = savedSignature === signature

    async function savePrediction() {
        if (isSaving) return

        setError(null)
        setSavedSignature(null)

        if (!token || !raceId) {
            setError("No se pudo guardar: volvé a cargar la página e intentá de nuevo.")
            return
        }
        const incomplete = requests.find((request) => !request.body)
        if (incomplete) {
            setError(`Completá la predicción: faltan datos para "${incomplete.leagueName}" (pole, posiciones, Safety Car o piloto seguido).`)
            return
        }

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), SAVE_TIMEOUT_MS)
        setIsSaving(true)

        try {
            const results = await Promise.allSettled(
                requests.map((request) =>
                    submitPrediction(token, request.leagueId, raceId, request.body!, controller.signal),
                ),
            )

            const failed = results.flatMap((result, i) =>
                result.status === "rejected" ? [{ leagueName: requests[i].leagueName, reason: result.reason }] : [],
            )

            if (failed.length === 0) {
                setSavedSignature(signature)
                return
            }

            const message = savePredictionErrorMessage(failed[0].reason)
            if (failed.length === requests.length) {
                setError(message)
            } else {
                const savedIn = requests
                    .filter((request) => !failed.some((f) => f.leagueName === request.leagueName))
                    .map((request) => request.leagueName)
                setError(
                    `Se guardó en ${savedIn.join(", ")}, pero falló en ${failed.map((f) => f.leagueName).join(", ")}: ${message}`,
                )
            }
        } finally {
            clearTimeout(timeout)
            setIsSaving(false)
        }
    }

    return { savePrediction, isSaving, saved, error }
}

// Mensajes del back y del navegador → castellano (el resto se muestra tal cual)
function savePredictionErrorMessage(err: unknown): string {
    if (err instanceof DOMException && err.name === "AbortError") {
        return "El servidor tardó demasiado en responder. Probá de nuevo en un momento."
    }
    // fetch tira TypeError cuando no hay conexión o el servidor no responde ("Failed to fetch", "Load failed")
    if (err instanceof TypeError) {
        return "No se pudo conectar con el servidor. Revisá tu conexión y probá de nuevo."
    }
    if (!(err instanceof Error)) return "No se pudo guardar la predicción"
    if (err.message === "Predictions are closed for this race") {
        return "Las predicciones de esta fecha ya cerraron (empezó la clasificación)."
    }
    if (/are not on the grid for this race/.test(err.message)) {
        return "Elegiste un piloto que no corre esta fecha. Revisá tu predicción."
    }
    return err.message
}
