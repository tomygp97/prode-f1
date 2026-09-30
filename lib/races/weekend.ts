import { RaceFromApi, RaceStatus } from "../api/races"

const ARG_TIMEZONE = "America/Argentina/Buenos_Aires"
const HOUR_MS = 60 * 60 * 1000

// No guardamos cuándo termina la qualy: dura ~1 h
const QUALIFYING_DURATION_MS = HOUR_MS
// "Resultados disponibles" se muestra hasta 24 h antes de la qualy siguiente
const RESULTS_BANNER_UNTIL_BEFORE_NEXT_QUALY_MS = 24 * HOUR_MS

/**
 * Fase del fin de semana en curso (la carrera que devuelve /races/current):
 * - qualifying: empezó la clasificación (primera hora)
 * - waiting-race: terminó la clasificación, falta la largada
 * - race: la carrera está corriendo (hasta que OpenF1 publica el resultado)
 * - results-pending: hay resultado oficial, se están calculando los puntos
 */
export type WeekendPhase = "qualifying" | "waiting-race" | "race" | "results-pending"

export function getWeekendPhase(race: RaceFromApi, now: Date): WeekendPhase {
  if (race.status === RaceStatus.FINISHED || race.status === RaceStatus.RESULTS_SYNCED) {
    return "results-pending"
  }

  const raceStart = race.raceStartAt ? new Date(race.raceStartAt).getTime() : null
  if (raceStart !== null && now.getTime() >= raceStart) return "race"

  const qualyStart = race.qualifyingStartAt ? new Date(race.qualifyingStartAt).getTime() : null
  if (qualyStart !== null && now.getTime() < qualyStart + QUALIFYING_DURATION_MS) return "qualifying"

  return "waiting-race"
}

/**
 * ¿Mostrar "Resultados de X disponibles"? Desde que hay resultados hasta 24 h antes de la
 * próxima qualy. Durante otro fin de semana en curso no (ahí manda la tarjeta en vivo).
 */
export function shouldShowResultsBanner(
  lastResults: RaceFromApi | null,
  next: RaceFromApi | null,
  current: RaceFromApi | null,
  now: Date,
): boolean {
  if (!lastResults || current) return false
  if (!next?.qualifyingStartAt) return true
  const nextQualy = new Date(next.qualifyingStartAt).getTime()
  return now.getTime() < nextQualy - RESULTS_BANNER_UNTIL_BEFORE_NEXT_QUALY_MS
}

/** "sáb 26 sept" y "09:00 hs ARG", en hora de Argentina. */
export function formatArgDateTime(iso: string | null | undefined): { day: string; time: string } {
  if (!iso) return { day: "A confirmar", time: "" }
  const date = new Date(iso)
  const day = new Intl.DateTimeFormat("es-AR", {
    weekday: "short", day: "numeric", month: "short", timeZone: ARG_TIMEZONE,
  }).format(date).replace(/[.,]/g, "")
  const time = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ARG_TIMEZONE,
  }).format(date)
  return { day, time: `${time} hs ARG` }
}

/** Tiempo que falta hasta `iso` desglosado (todo en 0 si ya pasó o no hay fecha). */
export function timeUntil(iso: string | null | undefined, now: Date) {
  const diff = iso ? Math.max(0, new Date(iso).getTime() - now.getTime()) : 0
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}
