"use client"

import { useState } from "react"
import { ArrowLeft, Check, List, LogIn, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLeague } from "@/context/league-context"
import { useDrivers } from "@/hooks/use-drivers"
import { useTeams } from "@/hooks/use-teams"
import { League } from "@/lib/api/leagues"
import { cn } from "@/lib/utils"
import { MyLeagues } from "@/components/leagues/my-leagues"
import { CreateLeagueForm } from "@/components/leagues/create-league-form"
import { JoinLeagueForm } from "@/components/leagues/join-league-form"
import { InviteShare } from "@/components/leagues/invite-share"

type Tab = "mis" | "crear" | "unirse"

const tabs = [
  { id: "mis" as const, label: "Mis Ligas", icon: List },
  { id: "crear" as const, label: "Crear", icon: Plus },
  { id: "unirse" as const, label: "Unirse", icon: LogIn },
]

export function Leagues({ initialCode }: { initialCode?: string }) {
  const router = useRouter()
  const { leagues, isLoading: leaguesLoading, reload } = useLeague()
  const { drivers } = useDrivers()
  const { teams } = useTeams()

  // Con ?code= (link de invitación) se abre directo en Unirse
  const [selectedTab, setSelectedTab] = useState<Tab | null>(initialCode ? "unirse" : null)
  const [createdLeague, setCreatedLeague] = useState<League | null>(null)
  const [joinedNotice, setJoinedNotice] = useState(false)

  // Sin pestaña elegida: Mis Ligas, o Crear si todavía no tiene ninguna
  const tab: Tab = selectedTab ?? (leaguesLoading || leagues.length > 0 ? "mis" : "crear")

  function selectTab(next: Tab) {
    setSelectedTab(next)
    setCreatedLeague(null)
    setJoinedNotice(false)
  }

  return (
    <div className="space-y-5 px-4 py-5">
      <button
        type="button"
        onClick={() => router.push("/home")}
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </button>

      <h1 className="font-heading text-2xl font-bold uppercase leading-tight">Ligas</h1>

      <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-card p-1">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTab(t.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg py-2.5 font-heading text-sm font-bold uppercase transition-colors",
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="size-4" /> {t.label}
            </button>
          )
        })}
      </div>

      {joinedNotice && (
        <p className="flex items-center gap-2 rounded-xl border border-arg/40 bg-arg/10 px-3 py-2.5 text-sm text-arg">
          <Check className="size-4" /> ¡Te uniste! Ya podés cargar tu predicción.
        </p>
      )}

      {tab === "mis" &&
        (leaguesLoading ? (
          <p className="text-center text-sm text-muted-foreground">Cargando ligas...</p>
        ) : (
          <MyLeagues drivers={drivers} />
        ))}

      {tab === "crear" && !createdLeague && (
        <CreateLeagueForm
          drivers={drivers}
          teams={teams}
          onCreated={(league) => {
            setCreatedLeague(league)
            reload(league.id)
          }}
        />
      )}

      {tab === "crear" && createdLeague && (
        <section className="space-y-4 rounded-2xl border border-arg/40 bg-card p-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-arg">
            <Check className="size-5" />
            <p className="font-heading text-lg font-bold uppercase">¡Liga creada!</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Compartí el código o el link para invitar a tus amigos a{" "}
            <strong className="text-foreground">{createdLeague.name}</strong>. Lo tenés siempre en Mis Ligas.
          </p>
          <InviteShare leagueName={createdLeague.name} inviteCode={createdLeague.inviteCode} />
        </section>
      )}

      {tab === "unirse" && (
        <JoinLeagueForm
          initialCode={initialCode}
          onJoined={(leagueId) => {
            reload(leagueId)
            setSelectedTab("mis")
            setJoinedNotice(true)
          }}
        />
      )}
    </div>
  )
}
