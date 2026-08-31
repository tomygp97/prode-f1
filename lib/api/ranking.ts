import { api } from './client';

export interface LeagueRankingEntry {
  rank: number;
  ranking: {
    id: string;
    leagueId: string;
    userId: string;
    totalPoints: number;
    racesCounted: number;
  };
}

export function getLeagueStandings(leagueId: string, token: string) {
  return api.get<LeagueRankingEntry[]>(`/leagues/${leagueId}/standings`, token);
}