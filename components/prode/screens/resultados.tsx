"use client"

import { Check, X, Flag } from "lucide-react"
import {
  officialResult,
  myPrediction,
  scoreBreakdown,
  getDriver,
  driverTeam,
} from "@/lib/f1-data"
import { DriverAvatar } from "@/components/prode/driver-avatar"
import { cn } from "@/lib/utils"

function DriverLine({
  driverId,
  position,
  correct,
}: {
  driverId: string
  position?: string
  correct?: boolean | "partial"
}) {
  const d = getDriver(driverId)
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      {position && (
        <span className="w-6 text-center font-heading text-sm font-bold text-muted-foreground">
          {position}
        </span>
      )}
      <DriverAvatar driver={d} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{d.code}</p>
        <p className="truncate text-[11px]" style={{ color: driverTeam(d.id).color }}>
          {driverTeam(d.id).name}
        </p>
      </div>
      {correct === true && <Check className="size-4 text-arg" />}
      {correct === "partial" && (
        <span className="rounded bg-primary/15 px-1.5 text-[10px] font-bold text-primary">+2</span>
      )}
      {correct === false && <X className="size-4 text-primary" />}
    </div>
  )
}

export function Resultados() {
  const total = scoreBreakdown.reduce((a, b) => a + b.points, 0)

  // compute correctness for my top5 vs official
  function top5State(driverId: string, index: number): boolean | "partial" | false {
    if (officialResult.top5[index] === driverId) return true
    if (officialResult.top5.includes(driverId)) return "partial"
    return false
  }

  return (
    <div className="space-y-5 px-4 py-5">
      <div>
        <span className="font-mono text-xs text-muted-foreground">Fecha 16 · Finalizado</span>
        <h1 className="font-heading text-2xl font-bold uppercase leading-tight">
          Resultados 🇮🇹 {officialResult.gpName}
        </h1>
      </div>

      {/* Total banner */}
      <div className="flex items-center justify-between rounded-2xl border border-arg/40 bg-gradient-to-r from-arg/15 to-transparent p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total fecha</p>
          <p className="font-heading text-xs text-arg">¡Buena fecha!</p>
        </div>
        <span className="font-heading text-4xl font-bold text-arg">+{total}</span>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-2 gap-3">
        {/* Mi predicción */}
        <div className="rounded-2xl border border-border bg-card p-3">
          <h2 className="mb-2 font-heading text-sm font-bold uppercase text-muted-foreground">
            Mi Predicción
          </h2>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Pole</p>
          <DriverLine
            driverId={myPrediction.pole}
            correct={myPrediction.pole === officialResult.pole}
          />
          <p className="mb-1 mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            Top 5
          </p>
          {myPrediction.top5.map((id, i) => (
            <DriverLine key={i} driverId={id} position={`P${i + 1}`} correct={top5State(id, i)} />
          ))}
        </div>

        {/* Resultado oficial */}
        <div className="rounded-2xl border border-border bg-card p-3">
          <h2 className="mb-2 flex items-center gap-1 font-heading text-sm font-bold uppercase">
            <Flag className="size-3.5 text-primary" /> Oficial
          </h2>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Pole</p>
          <DriverLine driverId={officialResult.pole} />
          <p className="mb-1 mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            Top 5
          </p>
          {officialResult.top5.map((id, i) => (
            <DriverLine key={i} driverId={id} position={`P${i + 1}`} />
          ))}
        </div>
      </div>

      {/* Extra factors */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Safety Car",
            mine: myPrediction.safetyCar ? "Sí" : "No",
            real: officialResult.safetyCar ? "Sí" : "No",
            ok: myPrediction.safetyCar === officialResult.safetyCar,
          },
          {
            label: "DNF",
            mine: String(myPrediction.dnf),
            real: String(officialResult.dnf),
            ok: myPrediction.dnf === officialResult.dnf,
          },
          {
            label: "Franco 🇦🇷",
            mine: `P${myPrediction.colapinto}`,
            real: `P${officialResult.colapinto}`,
            ok: myPrediction.colapinto === officialResult.colapinto,
          },
        ].map((f) => (
          <div key={f.label} className="rounded-2xl border border-border bg-card p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.label}</p>
            <p className="mt-1 font-heading text-xl font-bold">{f.mine}</p>
            <div
              className={cn(
                "mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                f.ok ? "bg-arg/15 text-arg" : "bg-primary/15 text-primary",
              )}
            >
              {f.ok ? <Check className="size-3" /> : <X className="size-3" />}
              {f.real}
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 font-heading text-base font-bold uppercase">Desglose de Puntos</h2>
        <ul className="divide-y divide-border">
          {scoreBreakdown.map((s) => (
            <li key={s.category} className="flex items-center justify-between gap-3 py-2.5">
              <div>
                <p className="text-sm font-semibold">{s.category}</p>
                <p className="text-xs text-muted-foreground">{s.detail}</p>
              </div>
              <span className="shrink-0 font-heading text-lg font-bold text-arg">+{s.points}</span>
            </li>
          ))}
          <li className="flex items-center justify-between gap-3 pt-3">
            <p className="font-heading text-base font-bold uppercase">Total Fecha</p>
            <span className="font-heading text-2xl font-bold text-primary">+{total}</span>
          </li>
        </ul>
      </section>
    </div>
  )
}
