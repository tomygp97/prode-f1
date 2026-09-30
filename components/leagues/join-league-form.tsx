"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { joinLeague } from "@/lib/api/leagues"
import { leagueErrorMessage, normalizeInviteCode } from "@/lib/leagues/invite"

const CODE_LENGTH = 6

export function JoinLeagueForm({
  initialCode = "",
  onJoined,
}: {
  initialCode?: string
  onJoined: (leagueId: string) => void
}) {
  const { token } = useAuth()
  const [code, setCode] = useState(() => normalizeInviteCode(initialCode))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleJoin() {
    if (!token) return
    setIsSubmitting(true)
    setError(null)
    try {
      const membership = await joinLeague(code, token)
      onJoined(membership.leagueId)
    } catch (err) {
      setError(leagueErrorMessage(err, "No se pudo unir a la liga"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col items-center py-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-arg/15 text-arg">
          <Users className="size-6" />
        </span>
        <p className="mt-2 font-heading text-lg font-bold uppercase">Unirse a una Liga</p>
        <p className="text-sm text-muted-foreground">Pedile el código de invitación a quien creó la liga.</p>
      </div>
      <div>
        <label htmlFor="invite-code" className="mb-1.5 block text-sm font-medium">Código de invitación</label>
        <input
          id="invite-code"
          value={code}
          onChange={(e) => {
            setCode(normalizeInviteCode(e.target.value))
            setError(null)
          }}
          autoCapitalize="characters"
          autoComplete="off"
          placeholder="ABC123"
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-center font-mono text-lg font-bold tracking-[0.3em] outline-none focus:border-primary placeholder:tracking-[0.3em] placeholder:text-muted-foreground/50"
        />
      </div>

      {error && <p className="text-center text-sm text-primary">{error}</p>}

      <button
        type="button"
        onClick={handleJoin}
        disabled={code.length !== CODE_LENGTH || isSubmitting}
        className="w-full rounded-xl bg-primary py-3.5 font-heading text-base font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-40"
      >
        {isSubmitting ? "Uniéndote..." : "Unirme a la Liga"}
      </button>
    </section>
  )
}
