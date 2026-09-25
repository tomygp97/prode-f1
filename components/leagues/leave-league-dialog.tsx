"use client"

import { useEffect, useState } from "react"
import { LogOut, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { fetchLeagueMembers, leaveLeague, UserLeague } from "@/lib/api/leagues"
import { leagueErrorMessage } from "@/lib/leagues/invite"

type Successor = { status: "loading" } | { status: "ready"; name: string | null } | { status: "error" }

/**
 * Confirmación para salir de una liga. Si sos admin, avisa a quién le queda
 * (el miembro más antiguo) o que la liga se elimina si sos el único.
 */
export function LeaveLeagueDialog({
  userLeague,
  onClose,
  onLeft,
}: {
  userLeague: UserLeague
  onClose: () => void
  onLeft: () => void
}) {
  const { token, user } = useAuth()
  const isAdmin = userLeague.role === "admin"
  const [successor, setSuccessor] = useState<Successor>({ status: "loading" })
  const [isLeaving, setIsLeaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdmin || !token) return
    let cancelled = false

    // /members viene ordenado por antigüedad: el primero que no soy yo hereda la liga
    fetchLeagueMembers(userLeague.league.id, token)
      .then((members) => {
        if (cancelled) return
        const next = members.find((member) => member.userId !== user?.id)
        setSuccessor({ status: "ready", name: next?.name ?? null })
      })
      .catch(() => {
        if (!cancelled) setSuccessor({ status: "error" })
      })

    return () => {
      cancelled = true
    }
  }, [isAdmin, token, user?.id, userLeague.league.id])

  async function handleLeave() {
    if (!token) return
    setIsLeaving(true)
    setError(null)
    try {
      await leaveLeague(userLeague.league.id, token)
      onLeft()
    } catch (err) {
      setError(leagueErrorMessage(err, "No se pudo salir de la liga"))
      setIsLeaving(false)
    }
  }

  let adminNotice: string | null = null
  if (isAdmin) {
    if (successor.status === "loading") adminNotice = "Buscando quién queda como admin..."
    else if (successor.status === "error") adminNotice = "Sos el admin: la liga va a pasar al miembro más antiguo."
    else if (successor.name) adminNotice = `Sos el admin: la liga va a pasar a ${successor.name}, el miembro más antiguo.`
    else adminNotice = "Sos el único miembro: si salís, la liga se elimina y el código deja de funcionar."
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
      />
      <div className="relative mx-auto w-full max-w-md space-y-4 rounded-t-3xl border-t border-border bg-card px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold uppercase">Salir de la liga</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          ¿Seguro que querés salir de <strong className="text-foreground">{userLeague.league.name}</strong>? Tus puntos
          se guardan: si volvés con el código, los recuperás.
        </p>

        {adminNotice && (
          <p className="rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5 text-sm">{adminNotice}</p>
        )}

        {error && <p className="text-sm text-primary">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-background py-3 font-heading text-sm font-bold uppercase"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleLeave}
            disabled={isLeaving || (isAdmin && successor.status === "loading")}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-3 font-heading text-sm font-bold uppercase text-primary-foreground disabled:opacity-40"
          >
            <LogOut className="size-4" /> {isLeaving ? "Saliendo..." : "Salir"}
          </button>
        </div>
      </div>
    </div>
  )
}
