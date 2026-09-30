import { api } from './client';

export interface CreateLeagueInput {
  name: string;
  isPublic: boolean;
  seasonId: string;
  predictionSlots?: number;
  trackedDriverId?: string;
}

// Lo que devuelve POST /leagues (incluye el código de invitación)
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

// En /leagues/me el código viene afuera de `league`
export interface UserLeague {
  league: Omit<League, 'inviteCode'>;
  role: "admin" | "member";
  joinedAt: string;
  membersCount: number;
  inviteCode: string;
}

export interface LeagueMember {
  userId: string;
  name: string;
  role: "admin" | "member";
  joinedAt: string;
}

export interface LeaveLeagueResult {
  newAdminUserId: string | null;
  leagueDeleted: boolean;
}

export function createLeague(input: CreateLeagueInput, token: string) {
  return api.post<League>('/leagues', input, token);
}

export function fetchUserLeagues(token: string): Promise<UserLeague[]> {
  return api.get<UserLeague[]>(`/leagues/me`, token)
}

export function joinLeague(inviteCode: string, token: string) {
  // Devuelve la membresía: sirve su leagueId para dejar activa la liga
  return api.post<{ leagueId: string }>('/leagues/join', { inviteCode }, token);
}

export function leaveLeague(leagueId: string, token: string) {
  return api.post<LeaveLeagueResult>(`/leagues/${leagueId}/leave`, {}, token);
}

// Miembros activos ordenados por antigüedad
export function fetchLeagueMembers(leagueId: string, token: string) {
  return api.get<LeagueMember[]>(`/leagues/${leagueId}/members`, token);
}
