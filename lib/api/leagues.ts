import { api } from './client';

const apiurl = process.env.NEXT_PUBLIC_API_URL;
if (!apiurl) {
    throw new Error("NEXT_PUBLIC_API_URL no está definida")
}

export interface CreateLeagueInput {
  name: string;
  isPublic: boolean;
  seasonId: string;
  predictionSlots?: number;
  trackedDriverId?: string;
}

export interface League {
  id: string;
  name: string;
  ownerId: string;
  inviteCode: string;
  isPublic: boolean;
  predictionSlots: number;
  seasonId: string;
  trackedDriverId: string | null;
}

export interface UserLeague {
  league: League;
  role: "owner" | "member";
  joinedAt: string;
  membersCount: number;
  inviteCode: string;
}

export function createLeague(input: CreateLeagueInput, token: string) {
  return api.post<League>('/leagues', input, token);
}

export async function fetchUserLeagues(token: string): Promise<UserLeague[]> {
  const res = await fetch(`${apiurl}/leagues/me`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error(`GET /leagues/me -> ${res.status}`)
  }
  const data = await res.json();
  return data;
}