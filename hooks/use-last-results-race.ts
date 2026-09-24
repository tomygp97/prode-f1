"use client"

import { fetchLastResultsSyncedRace, RaceFromApi } from "@/lib/api/races";
import { useEffect, useState } from "react";

// Última carrera con resultados oficiales sincronizados (null si todavía no hay ninguna)
export function useLastResultsRace() {
    const [race, setRace] = useState<RaceFromApi | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        let cancelled = false;

        fetchLastResultsSyncedRace()
        .then((data) => {
          if (!cancelled) {
            setRace(data)
            setIsLoading(false)
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : "Error")
            setIsLoading(false)
          }
        })
        return () => {
            cancelled = true
        }
    }, [])
    return { race, isLoading, error }
}
