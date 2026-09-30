"use client"

import { useEffect, useState } from "react"
import { getLeagueStandings, StandingEntry } from "@/lib/api/ranking"

type Loaded = { leagueId: string; standings: StandingEntry[]; error: string | null }

// Tabla de la liga (solo para miembros). La usan Ranking y Perfil.
export function useLeagueStandings(token: string | null | undefined, leagueId: string | undefined) {
    // Se guarda junto a la liga que lo pidió: al cambiar de liga no se ve la tabla anterior
    const [loaded, setLoaded] = useState<Loaded | null>(null)

    useEffect(() => {
        if (!token || !leagueId) return

        let cancelled = false

        getLeagueStandings(leagueId, token)
            .then((standings) => {
                if (!cancelled) setLoaded({ leagueId, standings, error: null })
            })
            .catch((err) => {
                if (cancelled) return
                setLoaded({
                    leagueId,
                    standings: [],
                    error: err instanceof Error ? err.message : "No se pudo cargar el ranking",
                })
            })

        return () => {
            cancelled = true
        }
    }, [token, leagueId])

    const current = token && leagueId && loaded?.leagueId === leagueId ? loaded : null
    return {
        standings: current?.standings ?? [],
        isLoading: Boolean(token && leagueId) && !current,
        error: current?.error ?? null,
    }
}
