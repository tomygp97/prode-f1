import { Team } from "../f1-data"

const apiurl = process.env.NEXT_PUBLIC_API_URL;
if (!apiurl) {
    throw new Error("NEXT_PUBLIC_API_URL no está definida")
}

export type TeamFromApi = {
    id: string,
    name: string,
    colour: string,
    seasonId: string,
}

export function toTeam(data: TeamFromApi): Team {
    return {
        id: data.id,
        name: data.name,
        colour: data.colour.startsWith("#") ? data.colour : `#${data.colour}`
    }
}

export async function fetchTeams(): Promise<Team[]> {
    const res = await fetch(`${apiurl}/teams`);
    if (!res.ok) {
        throw new Error(`GET /teams -> ${res.status}`)
    }
    const data: TeamFromApi[] = await res.json()
    return data.map(toTeam)
}