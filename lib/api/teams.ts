import { Team } from "../f1-data"
import { api } from "./client";

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
    return api
        .get<TeamFromApi[]>("/teams")
        .then((data) => data.map(toTeam))
}