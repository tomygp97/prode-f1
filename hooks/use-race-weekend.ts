"use client"

import { useEffect, useState } from "react"
import { fetchCurrentRace, fetchLastResultsSyncedRace, fetchNextRace, RaceFromApi } from "@/lib/api/races"

// Con la pantalla abierta se vuelve a preguntar: así "Carrera en curso" pasa a
// "Resultados disponibles" sin recargar (el back cambia de estado cada 2 min)
const REFRESH_MS = 2 * 60 * 1000

type RaceWeekend = {
    /** Fin de semana en curso (qualy empezada, sin resultados todavía) */
    current: RaceFromApi | null
    /** Próxima carrera con predicciones abiertas */
    next: RaceFromApi | null
    /** Última carrera con resultados */
    lastResults: RaceFromApi | null
}

type Loaded = RaceWeekend & { error: string | null }

export function useRaceWeekend() {
    const [loaded, setLoaded] = useState<Loaded | null>(null)

    useEffect(() => {
        let cancelled = false

        function load() {
            Promise.all([fetchCurrentRace(), fetchNextRace(), fetchLastResultsSyncedRace()])
                .then(([current, next, lastResults]) => {
                    if (!cancelled) setLoaded({ current, next, lastResults, error: null })
                })
                .catch((err) => {
                    if (cancelled) return
                    // Si falla un refresco se mantiene lo último que se mostró
                    setLoaded((prev) => ({
                        current: prev?.current ?? null,
                        next: prev?.next ?? null,
                        lastResults: prev?.lastResults ?? null,
                        error: prev ? null : err instanceof Error ? err.message : "Error",
                    }))
                })
        }

        load()
        const timer = setInterval(load, REFRESH_MS)
        return () => {
            cancelled = true
            clearInterval(timer)
        }
    }, [])

    return {
        current: loaded?.current ?? null,
        next: loaded?.next ?? null,
        lastResults: loaded?.lastResults ?? null,
        isLoading: loaded === null,
        error: loaded?.error ?? null,
    }
}
