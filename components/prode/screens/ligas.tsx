"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Users,
  Plus,
  LogIn,
  Copy,
  Check,
  Share2,
  Crown,
} from "lucide-react"
import { useNav } from "@/components/prode/nav-context"
import { league } from "@/lib/f1-data"
import { cn } from "@/lib/utils"

export function Ligas() {
  const { navigate } = useNav()
  const [tab, setTab] = useState<"crear" | "unirse">("crear")
  const [leagueName, setLeagueName] = useState("")
  const [season, setSeason] = useState("2026")
  const [joinCode, setJoinCode] = useState("")
  const [created, setCreated] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareLink = `prodef1.app/j/${league.inviteCode}`

  function copy(text: string) {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-5 px-4 py-5">
      <button
        type="button"
        onClick={() => navigate("inicio")}
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </button>

      <h1 className="font-heading text-2xl font-bold uppercase leading-tight">Ligas Privadas</h1>

      {/* Current league */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Crown className="size-5" />
            </span>
            <div>
              <p className="font-heading text-base font-bold">{league.name}</p>
              <p className="text-xs text-muted-foreground">
                {league.members.length} jugadores · Temporada {league.season}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-arg/15 px-2 py-1 text-[10px] font-semibold text-arg">
            Activa
          </span>
        </div>
      </section>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-1">
        {[
          { id: "crear" as const, label: "Crear Liga", icon: Plus },
          { id: "unirse" as const, label: "Unirse", icon: LogIn },
        ].map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id)
                setCreated(false)
              }}
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

      {tab === "crear" && !created && (
        <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nombre de la Liga</label>
            <input
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              placeholder="Ej: Los Cracks de la F1"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Temporada</label>
            <div className="grid grid-cols-2 gap-2">
              {["2026", "2027"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeason(s)}
                  className={cn(
                    "rounded-xl border py-2.5 font-heading font-bold transition-colors",
                    season === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCreated(true)}
            disabled={!leagueName}
            className="w-full rounded-xl bg-primary py-3.5 font-heading text-base font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-40"
          >
            Crear Liga
          </button>
        </section>
      )}

      {tab === "crear" && created && (
        <section className="space-y-4 rounded-2xl border border-arg/40 bg-card p-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-arg">
            <Check className="size-5" />
            <p className="font-heading text-lg font-bold uppercase">¡Liga creada!</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Compartí el código o el link para invitar a tus amigos a <strong className="text-foreground">{leagueName}</strong>.
          </p>

          <div>
            <p className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              Código de invitación
            </p>
            <button
              type="button"
              onClick={() => copy(league.inviteCode)}
              className="flex w-full items-center justify-between rounded-xl border border-dashed border-border bg-background px-4 py-3"
            >
              <span className="font-mono text-lg font-bold tracking-[0.2em]">
                {league.inviteCode}
              </span>
              {copied ? (
                <Check className="size-4 text-arg" />
              ) : (
                <Copy className="size-4 text-muted-foreground" />
              )}
            </button>
          </div>

          <div>
            <p className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              Link para compartir
            </p>
            <div className="flex gap-2">
              <span className="flex-1 truncate rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground">
                {shareLink}
              </span>
              <button
                type="button"
                onClick={() => copy(shareLink)}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-secondary px-3 text-sm font-medium"
              >
                <Share2 className="size-4" /> Copiar
              </button>
            </div>
          </div>
        </section>
      )}

      {tab === "unirse" && (
        <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-col items-center py-2 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-arg/15 text-arg">
              <Users className="size-6" />
            </span>
            <p className="mt-2 font-heading text-lg font-bold uppercase">Unirse a una Liga</p>
            <p className="text-sm text-muted-foreground">
              Pedile el código de invitación a quien creó la liga.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Código de invitación</label>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="PRODE-XXXX"
              className="w-full rounded-xl border border-border bg-background px-3 py-3 text-center font-mono text-lg font-bold tracking-[0.2em] outline-none focus:border-primary placeholder:tracking-normal placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="button"
            disabled={joinCode.length < 4}
            className="w-full rounded-xl bg-primary py-3.5 font-heading text-base font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-40"
          >
            Unirme a la Liga
          </button>
        </section>
      )}
    </div>
  )
}
