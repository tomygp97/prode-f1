"use client"

import { fetchRaceResults, RaceResultsFromApi } from "@/lib/api/races";
import { useEffect, useState } from "react";

type Loaded = { raceId: string; results: RaceResultsFromApi | null; error: string | null }

export function useRaceResults(raceId: string | undefined) {
    // Se guarda junto al raceId que lo pidió: si cambia la carrera, lo viejo no se muestra
    const [loaded, setLoaded] = useState<Loaded | null>(null)

    useEffect(() => {
        if (!raceId) return

        let cancelled = false;

        fetchRaceResults(raceId)
        .then((data) => {
          if (!cancelled) setLoaded({ raceId, results: data, error: null })
        })
        .catch((err) => {
          if (!cancelled) {
            setLoaded({ raceId, results: null, error: err instanceof Error ? err.message : "Error" })
          }
        })
        return () => {
            cancelled = true
        }
    }, [raceId])

    const current = raceId && loaded?.raceId === raceId ? loaded : null
    return {
        results: current?.results ?? null,
        isLoading: Boolean(raceId) && !current,
        error: current?.error ?? null,
    }
}
