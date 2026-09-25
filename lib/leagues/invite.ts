import { ApiRequestError } from "../api/client"

/** Link que abre la pestaña Unirse con el código cargado. */
export function inviteLink(inviteCode: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  return `${origin}/leagues?code=${inviteCode}`
}

/** Los códigos son 6 caracteres en mayúscula (sin 0, O, 1, I). */
export function normalizeInviteCode(value: string): string {
  return value.replace(/\s/g, "").toUpperCase().slice(0, 6)
}

// Mensajes del back → castellano para la UI
const leagueErrors: Record<string, string> = {
  "Invalid invite code": "No existe una liga con ese código.",
  "User is already a member of this league": "Ya sos parte de esta liga.",
  "You are not an active member of this league": "Ya no sos parte de esta liga.",
  "The tracked driver is not part of this season": "Ese piloto no corre esta temporada.",
}

export function leagueErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiRequestError) {
    return leagueErrors[err.message] ?? err.message
  }
  return err instanceof Error ? err.message : fallback
}
