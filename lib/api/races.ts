import { GrandPrix } from "../f1-data"
import { api } from "./client"

export const RaceStatus = {
    SCHEDULED: 'scheduled',
    LOCKED :'locked',
    FINISHED : 'finished',
    CANCELLED : 'cancelled',
    RESULTS_SYNCED : 'results_synced',
} as const

export type RaceStatus = (typeof RaceStatus)[keyof typeof RaceStatus]

export type RaceFromApi = {
    id: string
    seasonId: string
    name: string
    circuit: string
    country: string
    round: number
    qualifyingStartAt: string | null
    raceStartAt: string | null
    status: RaceStatus
    meetingKey: number
    raceSessionKey: number | null
    qualifyingSessionKey: number | null
    scoresCalculatedAt: string | null
}

export type RaceResultFromApi = {
    id: string
    raceId: string
    poleDriverId: string
    raceWinnerDriverId: string
    raceWinnerTeamId: string
    safetyCar: boolean
    dnfCount: number
    syncedAt: string
}

export type RaceDriverResultFromApi = {
    id: string
    raceId: string
    driverId: string
    teamId: string // equipo con el que corrió ESA carrera
    position: number | null
    dnf: boolean
}

// Piloto de la grilla de una carrera (GET /races/:id/entries)
export type RaceGridEntryFromApi = {
    driverId: string
    driverNumber: number
    name: string
    acronym: string
    team: { id: string; name: string; colour: string }
}

export type RaceResultsFromApi = {
    race: RaceFromApi
    result: RaceResultFromApi | null
    drivers: RaceDriverResultFromApi[]
}

// Nombres de país tal como vienen de OpenF1
const countryFlags: Record<string, string> = {
    Argentina: "🇦🇷",
    Australia: "🇦🇺",
    Austria: "🇦🇹",
    Azerbaijan: "🇦🇿",
    Bahrain: "🇧🇭",
    Belgium: "🇧🇪",
    Brazil: "🇧🇷",
    Canada: "🇨🇦",
    China: "🇨🇳",
    Hungary: "🇭🇺",
    Italy: "🇮🇹",
    Japan: "🇯🇵",
    Mexico: "🇲🇽",
    Monaco: "🇲🇨",
    Netherlands: "🇳🇱",
    Qatar: "🇶🇦",
    "Saudi Arabia": "🇸🇦",
    Singapore: "🇸🇬",
    Spain: "🇪🇸",
    "United Arab Emirates": "🇦🇪",
    "United Kingdom": "🇬🇧",
    "United States": "🇺🇸",
}

function mapPredictionStatus(status: RaceStatus): GrandPrix["status"] {
    switch(status) {
        case RaceStatus.SCHEDULED:
            return "abiertas"
        default:
            return "cerradas"
    }
}

export function toGrandPrix(race: RaceFromApi): GrandPrix {
    return {
        id: race.id,
        round: race.round,
        name: race.name,
        circuit: race.circuit,
        country: race.country,
        flag: countryFlags[race.country] ?? "🏁",
        date: race.raceStartAt ?? "",
        status: mapPredictionStatus(race.status),
    }
}

// El back responde con body vacío (→ null) cuando no hay próxima carrera
export async function fetchNextGP(): Promise<GrandPrix | null> {
    const race = await api.get<RaceFromApi | null>("/races/next")
    return race ? toGrandPrix(race) : null
}

export function fetchLastResultsSyncedRace(): Promise<RaceFromApi | null> {
    return api.get<RaceFromApi | null>("/races/last-results-synced")
}

export function fetchRaceResults(raceId: string): Promise<RaceResultsFromApi> {
    return api.get<RaceResultsFromApi>(`/races/${raceId}/results`)
}

// Grilla de la carrera; si todavía no tiene (antes de la FP1), el back devuelve la última conocida
export function fetchRaceEntries(raceId: string): Promise<RaceGridEntryFromApi[]> {
    return api.get<RaceGridEntryFromApi[]>(`/races/${raceId}/entries`)
}
