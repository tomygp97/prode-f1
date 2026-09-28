/**
 * Sesión guardada en localStorage, expuesta como store externo para useSyncExternalStore.
 * Se entera de cambios hechos desde esta pestaña (login/logout) y desde otras (evento storage).
 */

export interface SessionUser {
  id: string
  email: string
  name: string
}

export interface Session {
  token: string
  user: SessionUser
}

const TOKEN_KEY = "accessToken"
const USER_KEY = "user"

const listeners = new Set<() => void>()

// Respaldo si el navegador bloquea localStorage: la sesión dura mientras la pestaña esté abierta
let memorySession: Session | null = null

function notify() {
  for (const listener of listeners) listener()
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener)
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

/** Vencimiento del JWT (claim `exp`, en segundos) en ms; null si no se puede leer. */
export function tokenExpiresAt(token: string): number | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const { exp } = JSON.parse(atob(payload)) as { exp?: number }
    return typeof exp === "number" ? exp * 1000 : null
  } catch {
    return null
  }
}

function isExpired(token: string): boolean {
  const expiresAt = tokenExpiresAt(token)
  return expiresAt !== null && expiresAt <= Date.now()
}

// useSyncExternalStore exige devolver el mismo objeto mientras no cambie lo guardado
let cachedRaw: string | null = null
let cachedSession: Session | null = null

/** Sesión válida guardada, o null (sin sesión o con el token vencido). */
export function getSessionSnapshot(): Session | null {
  let token: string | null = null
  let rawUser: string | null = null
  try {
    token = localStorage.getItem(TOKEN_KEY)
    rawUser = localStorage.getItem(USER_KEY)
  } catch {
    return memorySession
  }

  const raw = token && rawUser ? `${token}\n${rawUser}` : null
  if (raw !== cachedRaw) {
    cachedRaw = raw
    try {
      cachedSession = token && rawUser ? { token, user: JSON.parse(rawUser) as SessionUser } : null
    } catch {
      cachedSession = null
    }
  }
  // Si se pudo leer pero no escribir (cuota, modo privado), la sesión está en memoria
  const session = cachedSession ?? memorySession
  return session && !isExpired(session.token) ? session : null
}

// En el servidor no hay sesión (la pantalla espera a hidratar para decidir)
export function getServerSessionSnapshot(): Session | null {
  return null
}

/** Hay un token guardado pero ya venció (para avisar "tu sesión expiró"). */
export function hasExpiredStoredToken(): boolean {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    return token !== null && isExpired(token)
  } catch {
    return false
  }
}

export function saveSession(session: Session) {
  try {
    localStorage.setItem(TOKEN_KEY, session.token)
    localStorage.setItem(USER_KEY, JSON.stringify(session.user))
  } catch {
    // sin storage la sesión no sobrevive a recargar la página
    memorySession = session
  }
  notify()
}

export function clearSession() {
  memorySession = null
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    // nada que limpiar
  }
  notify()
}
