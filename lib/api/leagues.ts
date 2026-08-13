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

export function createLeague(input: CreateLeagueInput, token: string) {
  return api.post<League>('/leagues', input, token);
}