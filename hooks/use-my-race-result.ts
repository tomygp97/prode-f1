"use client"

import { useEffect, useState } from "react"
import {
    fetchMyPrediction,
    fetchMyPredictionScore,
    Prediction,
    PredictionScore,
} from "@/lib/api/predictions"

type Loaded = {
    key: string
    prediction: Prediction | null
    score: PredictionScore | null
    error: string | null
}

// Mi predicción y mi puntaje para una carrera, en una liga (el puntaje depende de la liga)
export function useMyRaceResult(
    token: string | null | undefined,
    leagueId: string | undefined,
    raceId: string | undefined,
) {
    // Se guarda junto a la liga/carrera que lo pidió: al cambiar de liga no se ve el dato anterior
    const [loaded, setLoaded] = useState<Loaded | null>(null)
    const key = token && leagueId && raceId ? `${leagueId}:${raceId}` : null

    useEffect(() => {
        if (!token || !leagueId || !raceId) return

        const requestKey = `${leagueId}:${raceId}`
        let cancelled = false

        Promise.all([
            fetchMyPrediction(token, leagueId, raceId),
            fetchMyPredictionScore(token, leagueId, raceId),
        ])
            .then(([prediction, score]) => {
                if (!cancelled) setLoaded({ key: requestKey, prediction, score, error: null })
            })
            .catch((err) => {
                if (cancelled) return
                setLoaded({
                    key: requestKey,
                    prediction: null,
                    score: null,
                    error: err instanceof Error ? err.message : "No se pudo cargar tu resultado",
                })
            })

        return () => {
            cancelled = true
        }
    }, [token, leagueId, raceId])

    const current = key && loaded?.key === key ? loaded : null
    return {
        prediction: current?.prediction ?? null,
        score: current?.score ?? null,
        isLoading: key !== null && !current,
        error: current?.error ?? null,
    }
}
