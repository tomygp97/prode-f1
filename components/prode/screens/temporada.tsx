"use client"

import { useState } from "react"
import { ArrowLeft, Lock, Crown, Wrench, Check } from "lucide-react"
import { useNav } from "@/components/prode/nav-context"
import { DriverPicker, DriverSlot } from "@/components/prode/driver-picker"
import { teams } from "@/lib/f1-data"
import { cn } from "@/lib/utils"

export function Temporada() {
  const { navigate } = useNav()
  const [champion, setChampion] = useState<string | undefined>()
  const [constructor, setConstructor] = useState<string | undefined>()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <div className="space-y-5 px-4 py-5">
      <button
        type="button"
        onClick={() => navigate("inicio")}
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </button>

      <div>
        <h1 className="font-heading text-2xl font-bold uppercase leading-tight">
          Predicciones de Temporada
        </h1>
        <p className="text-sm text-muted-foreground">Temporada 2026 · 25 pts cada acierto</p>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
        <Lock className="mt-0.5 size-4 shrink-0" />
        <p>Estas predicciones quedarán bloqueadas al comenzar la temporada.</p>
      </div>

      {/* Champion */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-arg/15 text-arg">
            <Crown className="size-4" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold uppercase leading-none">
              Campeón de Pilotos
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">¿Quién gana el título 2026?</p>
          </div>
        </div>
        <DriverSlot
          driverId={champion}
          placeholder="Seleccionar piloto"
          onClick={() => setPickerOpen(true)}
        />
      </section>

      {/* Constructor */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Wrench className="size-4" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold uppercase leading-none">
              Campeón de Constructores
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Seleccioná tu escudería</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {teams.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setConstructor(t.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                constructor === t.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:bg-secondary",
              )}
            >
              <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: t.color }} />
              <span className="truncate font-medium">{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => {
          setSaved(true)
          setTimeout(() => navigate("inicio"), 1100)
        }}
        disabled={!champion || !constructor}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-heading text-base font-bold uppercase tracking-wide transition-all active:scale-[0.98] disabled:opacity-40",
          saved ? "bg-arg text-arg-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        {saved ? (
          <>
            <Check className="size-5" /> Guardado
          </>
        ) : (
          "Guardar Predicciones de Temporada"
        )}
      </button>

      <DriverPicker
        open={pickerOpen}
        title="Campeón de Pilotos"
        value={champion}
        onClose={() => setPickerOpen(false)}
        onSelect={(id) => setChampion(id)}
      />
    </div>
  )
}
