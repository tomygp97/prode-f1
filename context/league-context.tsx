"use client"

import { useAuth } from "@/context/auth-context"
import { fetchUserLeagues, UserLeague } from "@/lib/api/leagues"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type LeagueContextValue = {
    leagues: UserLeague[]
    activeLeague?: UserLeague
    activeLeagueId?: string
    setActiveLeagueId: (id: string) => void
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
  
          const storedLeagueId = localStorage.getItem('activeLeagueId')
          const storedLeagueIsValid = storedLeagueId && data.some((ul) => ul.league.id === storedLeagueId)

          if (storedLeagueIsValid) {
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
    }, [token])
  
        const activeLeague = useMemo(() => {
      if (!activeLeagueId) return undefined
  
      return leagues.find(
        (userLeague) => userLeague.league.id === activeLeagueId,
      )
    }, [leagues, activeLeagueId])
  
    function handleSetActiveLeagueId(id: string) {
      setActiveLeagueId(id)
      localStorage.setItem('activeLeagueId', id)
    }
  
    const value = useMemo(
      () => ({
        leagues,
        activeLeague,
        activeLeagueId,
        setActiveLeagueId: handleSetActiveLeagueId,
        isLoading,
        error,
      }),
      [
        leagues,
        activeLeague,
        activeLeagueId,
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

  
  