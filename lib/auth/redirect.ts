/**
 * Destino al que volver después de login/registro (?next=). Solo rutas internas de la app:
 * "/leagues?code=ABC123" sí; "https://otro.com", "//otro.com" o "/\otro.com" no
 * (evita que un link de la app mande a otro sitio).
 */
export function safeNextPath(value: string | string[] | undefined | null): string | null {
  if (typeof value !== "string") return null
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null
  return value
}

/** /login o /register conservando a dónde quería ir el usuario. */
export function withNext(path: "/login" | "/register", next: string | null): string {
  return next ? `${path}?next=${encodeURIComponent(next)}` : path
}

/** El destino es un link de invitación a una liga (para explicarle al usuario por qué ingresa). */
export function isInviteLink(next: string | null): boolean {
  return next !== null && next.startsWith("/leagues?") && next.includes("code=")
}
