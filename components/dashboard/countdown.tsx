"use client"

import { useNow } from "@/hooks/use-now"
import { timeUntil } from "@/lib/races/weekend"

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-full min-w-12 items-center justify-center rounded-lg border border-border bg-background/70 font-heading text-2xl font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  )
}

/** Cuenta regresiva (días, horas, minutos, segundos) hasta `target`. */
export function Countdown({ target, label }: { target: string; label: string }) {
  const c = timeUntil(target, useNow(1000))

  return (
    <div>
      <p className="mb-2 text-center text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="grid grid-cols-4 gap-2">
        <CountdownBox value={c.days} label="Días" />
        <CountdownBox value={c.hours} label="Hs" />
        <CountdownBox value={c.minutes} label="Min" />
        <CountdownBox value={c.seconds} label="Seg" />
      </div>
    </div>
  )
}

/** "4 d 20 h", "3 h 12 min" o "12 min" (para las tarjetas chicas). */
export function shortTimeUntil(target: string | null | undefined, now: Date): string {
  const c = timeUntil(target, now)
  if (c.days > 0) return `${c.days} d ${c.hours} h`
  if (c.hours > 0) return `${c.hours} h ${c.minutes} min`
  return `${c.minutes} min`
}
