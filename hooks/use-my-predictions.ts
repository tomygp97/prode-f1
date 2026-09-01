"use client"

import { useEffect, useState } from "react"
import { Prediction } from "@/lib/api/predictions"
import { UserLeague } from "@/lib/api/leagues"
import { fetchMyPrediction } from "@/lib/api/predictions"

type PredictionsByLeague = Record<string, Prediction | null>

export function useMyPredictions(
    leagues: UserLeague[],
    raceId: string | undefined,
    token: string | null | undefined,
) {
    const [predictions, setPredictions] = useState<PredictionsByLeague>({})
    const [isLoading, setIsloading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!token || !raceId || leagues.length === 0) {
            setPredictions({})
            setIsloading(false)
            setError(null)
            return
        }

        const authToken = token
        const currentRaceId = raceId
        
        let cancelled = false

        async function loadPredictions() {
            try {
                setIsloading(true)
                setError(null)

                const results = await Promise.all(
                    leagues.map(async (userLeague) => {
                        const leagueId = userLeague.league.id

                        const prediction = await fetchMyPrediction(authToken, leagueId, currentRaceId)

                        return {
                            leagueId,
                            prediction
                        }
                    })
                )

                if (cancelled) return
                const byLeague: PredictionsByLeague = {}
                for (const result of results) {
                    byLeague[result.leagueId] = result.prediction
                }

                setPredictions(byLeague)
            } catch (err) {
                if (cancelled) return
                setError(
                    err instanceof Error
                    ? err.message
                    : "No se pudo cargar las predicciones"
                )
            } finally {
                if (!cancelled) {
                    setIsloading(false)
                }
            }
        }

        loadPredictions()

        return () => {
            cancelled = true
        }
    }, [leagues, raceId, token])

    return {
        predictions,
        isLoading,
        error,
    }
}