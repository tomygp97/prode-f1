import { api } from './client';

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
  role: "admin" | "member";
  joinedAt: string;
  membersCount: number;
  inviteCode: string;
}

export function createLeague(input: CreateLeagueInput, token: string) {
  return api.post<League>('/leagues', input, token);
}

export function fetchUserLeagues(token: string): Promise<UserLeague[]> {
  return api.get<UserLeague[]>(`/leagues/me`, token)
}