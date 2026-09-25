"use client"

import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { createLeague, League } from "@/lib/api/leagues"
import { getCurrentSeason } from "@/lib/api/seasons"
import { Driver, Team } from "@/lib/f1-data"
import { leagueErrorMessage } from "@/lib/leagues/invite"
import { cn } from "@/lib/utils"
import { DriverPicker, DriverSlot } from "@/components/prode/driver-picker"

const SLOT_OPTIONS = [3, 5, 10] as const
const COLAPINTO_NUMBER = 43

export function CreateLeagueForm({
  drivers,
  teams,
  onCreated,
}: {
  drivers: Driver[]
  teams: Team[]
  onCreated: (league: League) => void
}) {
  const { token } = useAuth()
  const [name, setName] = useState("")
  const [slots, setSlots] = useState<number>(3)
  const [followColapinto, setFollowColapinto] = useState(false)
  const [trackedDriverId, setTrackedDriverId] = useState<string | undefined>()
  const [pickerOpen, setPickerOpen] = useState(false)

  const [seasonId, setSeasonId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCurrentSeason()
      .then((season) => setSeasonId(season.id))
      .catch(() => setError("No se pudo cargar la temporada actual"))
  }, [])

  const colapinto = drivers.find((driver) => driver.driverNumber === COLAPINTO_NUMBER)
  // Con la casilla tildada el piloto seguido es Colapinto y no se puede elegir otro
  const selectedTrackedId = followColapinto ? colapinto?.id : trackedDriverId

  async function handleSubmit() {
    if (!seasonId || !token) return
    setIsSubmitting(true)
    setError(null)
    try {
      const league = await createLeague(
        {
          name: name.trim(),
          isPublic: false,
          seasonId,
          predictionSlots: slots,
          trackedDriverId: selectedTrackedId,
        },
        token,
      )
      onCreated(league)
    } catch (err) {
      setError(leagueErrorMessage(err, "No se pudo crear la liga"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-card p-4">
      <div>
        <label htmlFor="league-name" className="mb-1.5 block text-sm font-medium">Nombre de la Liga</label>
        <input
          id="league-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="Ej: Los Cracks de la F1"
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium">Posiciones a predecir</p>
        <div className="grid grid-cols-3 gap-2">
          {SLOT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSlots(option)}
              className={cn(
                "rounded-xl border py-2.5 font-heading text-base font-bold uppercase transition-colors",
                slots === option
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-secondary",
              )}
            >
              Top {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-medium">Piloto a seguir <span className="text-muted-foreground">(opcional)</span></p>
        <p className="text-xs text-muted-foreground">
          Además del top, cada uno predice en qué posición termina este piloto.
        </p>

        {colapinto && (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
            <input
              type="checkbox"
              checked={followColapinto}
              onChange={(e) => setFollowColapinto(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            <span className="text-sm font-semibold">Seguir a Colapinto 🇦🇷</span>
          </label>
        )}

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <DriverSlot
              drivers={drivers}
              teams={teams}
              driverId={selectedTrackedId}
              placeholder="Elegir otro piloto"
              disabled={followColapinto}
              onClick={() => setPickerOpen(true)}
            />
          </div>
          {!followColapinto && trackedDriverId && (
            <button
              type="button"
              onClick={() => setTrackedDriverId(undefined)}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-secondary"
              aria-label="Quitar piloto seguido"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        {followColapinto && (
          <p className="flex items-center gap-1.5 text-xs text-arg">
            <Check className="size-3.5" /> Ya elegiste seguir a Colapinto. Destildá la casilla para elegir otro piloto.
          </p>
        )}
      </div>

      {error && <p className="text-sm text-primary">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={name.trim().length < 3 || !seasonId || isSubmitting}
        className="w-full rounded-xl bg-primary py-3.5 font-heading text-base font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-40"
      >
        {isSubmitting ? "Creando..." : "Crear Liga"}
      </button>
      {name.length > 0 && name.trim().length < 3 && (
        <p className="-mt-3 text-center text-xs text-muted-foreground">El nombre necesita al menos 3 letras.</p>
      )}

      <DriverPicker
        drivers={drivers}
        teams={teams}
        open={pickerOpen}
        title="Piloto a seguir"
        value={trackedDriverId}
        onClose={() => setPickerOpen(false)}
        onSelect={(id) => {
          setTrackedDriverId(id)
          setPickerOpen(false)
        }}
      />
    </section>
  )
}
