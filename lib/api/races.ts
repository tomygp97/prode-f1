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
    qualifyingStartAt: string
    raceStartAt: string
    status: RaceStatus
    meetingKey: number
    raceSessionKey: number
    qualifyingSessionKey: number
    scoresCalculatedAt: string | null
}

const countryFlags: Record<string, string> = {
    Netherlands: "🇳🇱",
    Italy: "🇮🇹",
    Argentina: "🇦🇷",
    Monaco: "🇲🇨",
    Spain: "🇪🇸",
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
        date: race.raceStartAt,
        status: mapPredictionStatus(race.status),
    }
}

export async function fetchNextGP(): Promise<GrandPrix> {
    return api
        .get<RaceFromApi>("/races/next")
        .then(toGrandPrix)
}