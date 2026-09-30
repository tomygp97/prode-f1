"use client"

import { useEffect, useMemo, useState } from "react";
import { fetchRaceEntries, RaceGridEntryFromApi } from "@/lib/api/races";
import { Driver, Team } from "@/lib/f1-data";

type Loaded = { raceId: string; entries: RaceGridEntryFromApi[]; error: string | null }

/**
 * Grilla de una carrera: solo los pilotos que la corren, con el equipo de esa carrera.
 * Devuelve drivers/teams con la misma forma que useDrivers/useTeams, así los selectores
 * (DriverPicker, DriverSlot) no cambian.
 */
export function useRaceEntries(raceId: string | undefined) {
    // Se guarda junto a la carrera que lo pidió: si cambia, no se muestra la grilla anterior
    const [loaded, setLoaded] = useState<Loaded | null>(null)

    useEffect(() => {
        if (!raceId) return

        let cancelled = false;

        fetchRaceEntries(raceId)
        .then((entries) => {
          if (!cancelled) setLoaded({ raceId, entries, error: null })
        })
        .catch((err) => {
          if (!cancelled) {
            setLoaded({ raceId, entries: [], error: err instanceof Error ? err.message : "Error" })
          }
        })
        return () => {
            cancelled = true
        }
    }, [raceId])

    const current = raceId && loaded?.raceId === raceId ? loaded : null

    const { drivers, teams } = useMemo(() => {
        const entries = current?.entries ?? []
        const drivers: Driver[] = entries.map((entry) => ({
            id: entry.driverId,
            driverNumber: entry.driverNumber,
            name: entry.name,
            acronym: entry.acronym,
            teamId: entry.team.id,
        }))
        const teamsById = new Map<string, Team>()
        for (const { team } of entries) {
            teamsById.set(team.id, {
                id: team.id,
                name: team.name,
                colour: team.colour.startsWith("#") ? team.colour : `#${team.colour}`,
            })
        }
        return { drivers, teams: [...teamsById.values()] }
    }, [current])

    return {
        drivers,
        teams,
        isLoading: Boolean(raceId) && !current,
        error: current?.error ?? null,
    }
}
