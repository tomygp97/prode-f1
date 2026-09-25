import { api } from './client';

export interface StandingEntry {
  rank: number;
  userId: string;
  userName: string;
  totalPoints: number;
  racesCounted: number;
  raceWins: number;
  trend: "up" | "down" | "same";
}

export function getLeagueStandings(leagueId: string, token: string) {
  return api.get<StandingEntry[]>(`/leagues/${leagueId}/standings`, token);
}