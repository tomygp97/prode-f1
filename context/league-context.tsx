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
  
  const LeagueContext = createContext<LeagueContextValue | undefined>(undefined)
  
  export function LeagueProvider({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { token } = useAuth()
  
    const [leagues, setLeagues] = useState<UserLeague[]>([])
    const [activeLeagueId, setActiveLeagueId] = useState<string>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [reloadKey, setReloadKey] = useState(0)
    const preferredLeagueIdRef = useRef<string | undefined>(undefined)

    useEffect(() => {
      if (!token) {
        setLeagues([])
        setActiveLeagueId(undefined)
        setIsLoading(false)
        setError(null)
        return
      }

      const authToken = token
  
      let cancelled = false
  
      async function loadLeagues() {
        try {
          setIsLoading(true)
          setError(null)
  
          const data = await fetchUserLeagues(authToken)
  
          if (cancelled) return
  
          setLeagues(data)
  
          const preferredLeagueId = preferredLeagueIdRef.current
          preferredLeagueIdRef.current = undefined
          const storedLeagueId = readStoredLeagueId()
          const storedLeagueIsValid = storedLeagueId && data.some((ul) => ul.league.id === storedLeagueId)

          if (preferredLeagueId && data.some((ul) => ul.league.id === preferredLeagueId)) {
            setActiveLeagueId(preferredLeagueId)
            storeLeagueId(preferredLeagueId)
          } else if (storedLeagueIsValid) {
            setActiveLeagueId(storedLeagueId)
          } else if (data.length > 0) {
            const mostRecent = [...data].sort(
              (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
            )[0]
            setActiveLeagueId(mostRecent.league.id)
          } else {
            setActiveLeagueId(undefined)
          }
        } catch (err) {
          if (cancelled) return
  
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las ligas",
          )
        } finally {
          if (!cancelled) {
            setIsLoading(false)
          }
        }
      }
  
      loadLeagues()
  
      return () => {
        cancelled = true
      }
    }, [token, reloadKey])

    const reload = useCallback((preferLeagueId?: string) => {
      preferredLeagueIdRef.current = preferLeagueId
      setReloadKey((key) => key + 1)
    }, [])
  
    const activeLeague = useMemo(() => {
      if (!activeLeagueId) return undefined
  
      return leagues.find(
        (userLeague) => userLeague.league.id === activeLeagueId,
      )
    }, [leagues, activeLeagueId])
  
    const handleSetActiveLeagueId = useCallback((id: string) => {
      setActiveLeagueId(id)
      storeLeagueId(id)
    }, [])

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

  
  
