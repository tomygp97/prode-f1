"use client"

import { useAuth } from "@/context/auth-context"
import { fetchUserLeagues, UserLeague } from "@/lib/api/leagues"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

// La liga elegida se recuerda en el navegador. localStorage puede fallar
// (modo privado, storage bloqueado): en ese caso simplemente no se recuerda.
const ACTIVE_LEAGUE_KEY = "activeLeagueId"

function readStoredLeagueId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_LEAGUE_KEY)
  } catch {
    return null
  }
}

function storeLeagueId(id: string) {
  try {
    localStorage.setItem(ACTIVE_LEAGUE_KEY, id)
  } catch {
    // sin persistencia: la elección vale solo para esta sesión
  }
}

// Liga activa por defecto: la pedida al recargar, si no la recordada, si no la más reciente
function pickDefaultLeagueId(leagues: UserLeague[], preferredLeagueId?: string): string | undefined {
  const exists = (id: string | null | undefined): id is string =>
    Boolean(id) && leagues.some((ul) => ul.league.id === id)

  if (exists(preferredLeagueId)) {
    storeLeagueId(preferredLeagueId)
    return preferredLeagueId
  }
  const storedLeagueId = readStoredLeagueId()
  if (exists(storedLeagueId)) return storedLeagueId

  const mostRecent = [...leagues].sort(
    (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
  )[0]
  return mostRecent?.league.id
}

type LeagueContextValue = {
    leagues: UserLeague[]
    activeLeague?: UserLeague
    activeLeagueId?: string
    setActiveLeagueId: (id: string) => void
    /** Vuelve a cargar las ligas (después de crear, unirse o salir). Opcional: la liga que queda activa. */
    reload: (preferLeagueId?: string) => void
    isLoading: boolean
    error: string | null
  }

// Resultado de una carga, guardado junto al token y la recarga que lo pidieron
type Loaded = {
  token: string
  reloadKey: number
  leagues: UserLeague[]
  defaultLeagueId?: string
  error: string | null
}

  const LeagueContext = createContext<LeagueContextValue | undefined>(undefined)

  export function LeagueProvider({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { token } = useAuth()

    const [loaded, setLoaded] = useState<Loaded | null>(null)
    const [chosenLeagueId, setChosenLeagueId] = useState<string>()
    const [reloadKey, setReloadKey] = useState(0)
    const preferredLeagueIdRef = useRef<string | undefined>(undefined)

    useEffect(() => {
      // Sin sesión no se carga nada: todo lo que se expone se deriva abajo
      if (!token) return

      let cancelled = false

      fetchUserLeagues(token)
        .then((leagues) => {
          if (cancelled) return
          const preferredLeagueId = preferredLeagueIdRef.current
          preferredLeagueIdRef.current = undefined
          setLoaded({
            token,
            reloadKey,
            leagues,
            defaultLeagueId: pickDefaultLeagueId(leagues, preferredLeagueId),
            error: null,
          })
        })
        .catch((err) => {
          if (cancelled) return
          setLoaded({
            token,
            reloadKey,
            leagues: [],
            error: err instanceof Error ? err.message : "No se pudieron cargar las ligas",
          })
        })

      return () => {
        cancelled = true
      }
    }, [token, reloadKey])

    const reload = useCallback((preferLeagueId?: string) => {
      preferredLeagueIdRef.current = preferLeagueId
      // La liga a mostrar la decide la recarga (la nueva, o la recordada), no una elección vieja
      setChosenLeagueId(undefined)
      setReloadKey((key) => key + 1)
    }, [])

    const handleSetActiveLeagueId = useCallback((id: string) => {
      setChosenLeagueId(id)
      storeLeagueId(id)
    }, [])

    // Datos de este usuario (mientras recarga se siguen mostrando los anteriores)
    const sameUser = token !== null && loaded?.token === token
    const current = sameUser && loaded?.reloadKey === reloadKey ? loaded : null
    const leagues = useMemo(() => (sameUser ? loaded.leagues : []), [sameUser, loaded])
    const isLoading = token !== null && current === null
    const error = current?.error ?? null

    const chosenIsValid = leagues.some((ul) => ul.league.id === chosenLeagueId)
    const activeLeagueId = chosenIsValid ? chosenLeagueId : sameUser ? loaded.defaultLeagueId : undefined

    const activeLeague = useMemo(() => {
      if (!activeLeagueId) return undefined

      return leagues.find(
        (userLeague) => userLeague.league.id === activeLeagueId,
      )
    }, [leagues, activeLeagueId])

    const value = useMemo(
      () => ({
        leagues,
        activeLeague,
        activeLeagueId,
        setActiveLeagueId: handleSetActiveLeagueId,
        reload,
        isLoading,
        error,
      }),
      [
        leagues,
        activeLeague,
        activeLeagueId,
        handleSetActiveLeagueId,
        reload,
        isLoading,
        error,
      ],
    )

    return (
      <LeagueContext.Provider value={value}>
        {children}
      </LeagueContext.Provider>
    )
  }

  export function useLeague() {
    const ctx = useContext(LeagueContext)
    if (!ctx) throw new Error("useLeague must be used within LeagueProvider")
    return ctx
  }
