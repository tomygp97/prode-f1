"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Lock,
  Trophy,
  ListOrdered,
  ShieldAlert,
  CarFront,
  Info,
  Check,
  Minus,
  Plus,
} from "lucide-react"
import { DriverPicker, DriverSlot } from "@/components/prode/driver-picker"
import { scoring } from "@/lib/f1-data"
import { useNav } from "@/components/prode/nav-context"
import { cn } from "@/lib/utils"
import { useNextGP } from "@/hooks/use-next-gp"

type PickerState =
  | { kind: "pole" }
  | { kind: "top5"; index: number }
  | { kind: "franco" }
  | null

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Trophy
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-4" />
        </span>
        <div>
          <h2 className="font-heading text-base font-bold uppercase leading-none">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

export function Predictions() {
  const { navigate } = useNav();
  const { nextGP } = useNextGP();
  const [pole, setPole] = useState<string | undefined>();
  const [top5, setTop5] = useState<(string | undefined)[]>([
    undefined, undefined, undefined, undefined, undefined,
  ]);
  const [safetyCar, setSafetyCar] = useState<boolean | null>(null);
  const [dnf, setDnf] = useState(2);
  const [franco, setFranco] = useState<number | null>(null);
  const [picker, setPicker] = useState<PickerState>(null);
  const [saved, setSaved] = useState(false);

  if (!nextGP) {
    return <div className="px-4 py-5 text-muted-foreground">No hay próximo GP</div>
  }

  function handleSelect(id: string) {
    if (!picker) return
    if (picker.kind === "pole") setPole(id)
    if (picker.kind === "top5") {
      setTop5((prev) => prev.map((v, i) => (i === picker.index ? id : v)))
    }
  }

  function pickerProps() {
    if (!picker) return { title: "", value: undefined, exclude: [] as string[] }
    if (picker.kind === "pole") return { title: "Elegí la Pole", value: pole, exclude: [] as string[] }
    if (picker.kind === "top5") {
      const ex = top5.filter((v, i) => v && i !== picker.index) as string[]
      return { title: `Elegí P${picker.index + 1}`, value: top5[picker.index], exclude: ex }
    }
    return { title: "", value: undefined, exclude: [] as string[] }
  }

  const pp = pickerProps()

  return (
    <div className="space-y-5 px-4 py-5">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase leading-tight">
          Predicciones {nextGP.flag} {nextGP.name}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          Las predicciones se bloquean al comenzar la clasificación.
        </p>
      </div>

      {/* Pole */}
      <SectionCard icon={Trophy} title="Pole Position" subtitle="¿Quién larga primero el domingo?">
        <DriverSlot
          driverId={pole}
          placeholder="Seleccionar piloto"
          onClick={() => setPicker({ kind: "pole" })}
        />
      </SectionCard>

      {/* Top 5 */}
      <SectionCard icon={ListOrdered} title="Top 5 Carrera" subtitle="No se pueden repetir pilotos.">
        <div className="space-y-2">
          {top5.map((id, i) => (
            <DriverSlot
              key={i}
              position={`P${i + 1}`}
              driverId={id}
              placeholder={`Seleccionar P${i + 1}`}
              onClick={() => setPicker({ kind: "top5", index: i })}
            />
          ))}
        </div>
      </SectionCard>

      {/* Safety Car */}
      <SectionCard icon={ShieldAlert} title="Safety Car" subtitle="¿Habrá Safety Car durante la carrera?">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Sí", val: true },
            { label: "No", val: false },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => setSafetyCar(o.val)}
              className={cn(
                "rounded-xl border py-3 font-heading text-lg font-bold uppercase transition-colors",
                safetyCar === o.val
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-secondary",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* DNF */}
      <SectionCard icon={CarFront} title="DNF" subtitle="¿Cuántos pilotos abandonarán la carrera?">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setDnf((v) => Math.max(0, v - 1))}
            className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
            disabled={dnf === 0}
            aria-label="Restar"
          >
            <Minus className="size-5" />
          </button>
          <div className="flex flex-col items-center">
            <span className="font-heading text-4xl font-bold tabular-nums">{dnf}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              abandonos
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDnf((v) => Math.min(10, v + 1))}
            className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
            disabled={dnf === 10}
            aria-label="Sumar"
          >
            <Plus className="size-5" />
          </button>
        </div>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 11 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setDnf(i)}
              aria-label={`${i} abandonos`}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= dnf ? "bg-primary" : "bg-secondary",
              )}
            />
          ))}
        </div>
      </SectionCard>

      {/* Franco Colapinto special */}
      <section className="overflow-hidden rounded-2xl border border-arg/40 bg-card">
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, #74ACDF, #fff, #74ACDF)" }}
        />
        <div className="flex items-center gap-3 p-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-arg/50">
            <Image
                src="/colapinto.png"
                alt="Franco Colapinto"
                fill
                sizes="64px"
                className="object-cover"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-arg/15 px-2 py-0.5 text-[10px] font-semibold text-arg">
              🇦🇷 El Argentino
            </span>
            <h2 className="mt-1 font-heading text-xl font-bold uppercase leading-none">
              Franco Colapinto
            </h2>
            <p className="text-xs text-muted-foreground">Alpine · #43 · +10 pts si acertás</p>
          </div>
        </div>
        <div className="px-4 pb-4">
          <p className="mb-2 text-sm font-medium">¿En qué posición terminará Franco?</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {Array.from({ length: 20 }).map((_, i) => {
              const pos = i + 1
              return (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setFranco(pos)}
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg border font-heading text-sm font-bold transition-colors",
                    franco === pos
                      ? "border-arg bg-arg text-arg-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-secondary",
                  )}
                >
                  P{pos}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Scoring summary */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Info className="size-4 text-muted-foreground" />
          <h2 className="font-heading text-base font-bold uppercase">Resumen de Puntajes</h2>
        </div>
        <ul className="divide-y divide-border">
          {scoring.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="shrink-0 rounded-md bg-primary/15 px-2 py-0.5 font-heading text-sm font-bold text-primary">
                +{s.points}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={() => {
          setSaved(true)
          setTimeout(() => navigate("inicio"), 1100)
        }}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-heading text-base font-bold uppercase tracking-wide transition-all active:scale-[0.98]",
          saved ? "bg-arg text-arg-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        {saved ? (
          <>
            <Check className="size-5" /> Predicción Guardada
          </>
        ) : (
          "Guardar Predicción"
        )}
      </button>

      <DriverPicker
        open={picker !== null}
        title={pp.title}
        value={pp.value}
        exclude={pp.exclude}
        onClose={() => setPicker(null)}
        onSelect={handleSelect}
      />
    </div>
  )
}
