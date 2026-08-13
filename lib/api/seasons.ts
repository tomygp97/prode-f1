import { api } from './client';

export interface Season {
  id: string;
  year: number;
}

export function getCurrentSeason() {
  return api.get<Season>('/seasons/current');
}