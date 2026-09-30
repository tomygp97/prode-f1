"use client"

import { useEffect, useMemo, useState } from "react"
import { Prediction } from "@/lib/api/predictions"
import { UserLeague } from "@/lib/api/leagues"
import { fetchMyPrediction } from "@/lib/api/predictions"

type PredictionsByLeague = Record<string, Prediction | null>

type Loaded = { key: string; predictions: PredictionsByLeague; error: string | null }

const NO_PREDICTIONS: PredictionsByLeague = {}

// Mis predicciones de una carrera, una por liga
export function useMyPredictions(
    leagues: UserLeague[],
    raceId: string | undefined,
    token: string | null | undefined,
) {
    const leagueIds = useMemo(() => leagues.map((ul) => ul.league.id).sort(), [leagues])
    // La carga se identifica por carrera + ligas: recargar la lista de ligas sin cambios
    // no vuelve a pedir nada (ni pisa lo que el usuario está editando)
    const key = token && raceId && leagueIds.length > 0 ? `${raceId}|${leagueIds.join(",")}` : null

    const [loaded, setLoaded] = useState<Loaded | null>(null)

    useEffect(() => {
        if (!key || !token || !raceId) return

        let cancelled = false
        const requestKey = key

        Promise.all(
            requestKey.split("|")[1].split(",").map(async (leagueId) => ({
                leagueId,
                prediction: await fetchMyPrediction(token, leagueId, raceId),
            })),
        )
            .then((results) => {
                if (cancelled) return
                const byLeague: PredictionsByLeague = {}
                for (const result of results) {
                    byLeague[result.leagueId] = result.prediction
                }
                setLoaded({ key: requestKey, predictions: byLeague, error: null })
            })
            .catch((err) => {
                if (cancelled) return
                setLoaded({
                    key: requestKey,
                    predictions: {},
                    error: err instanceof Error ? err.message : "No se pudo cargar las predicciones",
                })
            })

        return () => {
            cancelled = true
        }
    }, [key, token, raceId])

    const current = key && loaded?.key === key ? loaded : null

    return {
        predictions: current?.predictions ?? NO_PREDICTIONS,
        isLoading: key !== null && current === null,
        error: current?.error ?? null,
    }
}
