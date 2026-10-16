"use client"

import { Trophy, Medal, TrendingUp, Star, Crown, LogOut, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useLeague } from "@/context/league-context"
import { useLeagueStandings } from "@/hooks/use-league-standings"
import { cn, initials } from "@/lib/utils"
import { ProfileStatsSkeleton } from "@/components/skeletons/screen-skeletons"
import { ChangePasswordForm } from "@/components/profile/change-password-form"
import { useMe } from "@/hooks/use-me"
import Link from "next/link"

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Trophy
  label: string
  value: string
  accent?: "arg" | "primary"
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-lg",
          accent === "arg" ? "bg-arg/15 text-arg" : "bg-primary/15 text-primary",
        )}
      >
        <Icon className="size-4" />
      </span>
      <p className="mt-2 font-heading text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function Profile() {
  const { user, token, logout } = useAuth()
  const { activeLeague, isLoading: leaguesLoading } = useLeague()
  const { isAppAdmin } = useMe(token)
  const router = useRouter()

  const { standings, isLoading: standingsLoading } = useLeagueStandings(token, activeLeague?.league.id)
  const isLoading = leaguesLoading || standingsLoading

  const myStanding = standings.find((s) => s.userId === user?.id)

  function handleLogout() {
    logout()
    router.push("/login")
  }

  const userInitials = user?.name ? initials(user.name) : "?"

  return (
    <div className="space-y-5 px-4 py-5">
      {/* Header card */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-16 w-full bg-gradient-to-r from-primary/30 via-primary/10 to-arg/20" />
        <div className="px-4 pb-4">
          <div className="-mt-8 flex items-end gap-3">
            <div className="flex size-20 items-center justify-center rounded-2xl border-4 border-card bg-secondary font-heading text-2xl font-bold">
              {userInitials}
            </div>
            <div className="pb-1">
              <h1 className="font-heading text-xl font-bold uppercase leading-none">
                {user?.name ?? "—"}
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {myStanding && (
              <span className="inline-flex items-center gap-1 rounded-full bg-arg/15 px-2.5 py-1 text-xs font-semibold text-arg">
                <Trophy className="size-3" /> {myStanding.rank}º en {activeLeague?.league.name}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Stats grid */}
      {isLoading ? (
        <ProfileStatsSkeleton />
      ) : !activeLeague ? (
        <p className="text-center text-sm text-muted-foreground">
          Todavía no estás en ninguna liga. Creá o unite a una desde &quot;Mis Ligas&quot;.
        </p>
      ) : myStanding ? (
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Crown} label="Puntos totales" value={String(myStanding.totalPoints)} accent="primary" />
          <Stat icon={TrendingUp} label="Posición actual" value={`${myStanding.rank}º`} accent="arg" />
          <Stat icon={Medal} label="Carreras puntuadas" value={String(myStanding.racesCounted)} accent="primary" />
          <Stat icon={Star} label="Fechas ganadas" value={String(myStanding.raceWins)} accent="arg" />
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Todavía no tenés puntaje en {activeLeague.league.name} — cargá tu primer pronóstico.
        </p>
      )}

      {/* Cuenta */}
      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <h2 className="font-heading text-sm font-bold uppercase text-muted-foreground">Cuenta</h2>
        <ChangePasswordForm />
        {/* Solo admins de la app (los devs), no de una liga */}
        {isAppAdmin && (
          <Link
            href="/admin"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-arg/40 bg-arg/10 py-3 text-sm font-semibold text-arg transition-colors hover:bg-arg/20"
          >
            <ShieldCheck className="size-4" /> Panel de admin
          </Link>
        )}
      </section>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="size-4" /> Cerrar sesión
      </button>
    </div>
  )
}