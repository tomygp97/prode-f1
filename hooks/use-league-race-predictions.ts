"use client"

import { useEffect, useState } from "react"
import { ApiRequestError } from "@/lib/api/client"
import { fetchLeagueRacePredictions, LeaguePredictionEntry } from "@/lib/api/predictions"

type Loaded = {
    key: string
    entries: LeaguePredictionEntry[]
    hidden: boolean
    error: string | null
}

/**
 * Predicciones de todos los miembros de la liga para una carrera. `hidden` = el back todavía
 * no las muestra (predicciones abiertas): no es un error, la pantalla simplemente no las lista.
 */
export function useLeagueRacePredictions(
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

        fetchLeagueRacePredictions(token, leagueId, raceId)
            .then((data) => {
                if (!cancelled) setLoaded({ key: requestKey, entries: data.entries, hidden: false, error: null })
            })
            .catch((err) => {
                if (cancelled) return
                const hidden = err instanceof ApiRequestError && err.statusCode === 403
                setLoaded({
                    key: requestKey,
                    entries: [],
                    hidden,
                    error: hidden ? null : err instanceof Error ? err.message : "No se pudieron cargar las predicciones de la liga",
                })
            })

        return () => {
            cancelled = true
        }
    }, [token, leagueId, raceId])

    const current = key && loaded?.key === key ? loaded : null
    return {
        entries: current?.entries ?? [],
        hidden: current?.hidden ?? false,
        isLoading: key !== null && !current,
        error: current?.error ?? null,
    }
}
