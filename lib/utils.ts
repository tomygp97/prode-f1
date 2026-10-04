import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** "Juan Cruz Pérez" → "JC" (para avatares sin foto). */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function normalizeHex(hex: string): string {
  return hex.startsWith('#') ? hex : `#${hex}`
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const value = normalizeHex(hex).slice(1)
  if (value.length === 3) {
    return {
      r: parseInt(value[0] + value[0], 16),
      g: parseInt(value[1] + value[1], 16),
      b: parseInt(value[2] + value[2], 16),
    }
  }
  if (value.length === 6) {
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
    }
  }
  return null
}

function isMutedColour(rgb: { r: number; g: number; b: number }): boolean {
  const max = Math.max(rgb.r, rgb.g, rgb.b)
  const min = Math.min(rgb.r, rgb.g, rgb.b)
  const saturation = max === 0 ? 0 : (max - min) / max
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return saturation < 0.15 && luminance < 0.75
}

/** Lightens gray/muted team colours so they stay visible on dark UI. */
export function displayColour(hex: string): string {
  const rgb = parseHex(hex)
  if (!rgb) return '#666'

  if (!isMutedColour(rgb)) return normalizeHex(hex)

  const mix = (channel: number) =>
    Math.min(255, Math.round(channel * 0.55 + 255 * 0.45))

  return `#${[mix(rgb.r), mix(rgb.g), mix(rgb.b)]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`
}

export function teamColourStyles(hex: string): {
  colour: string
  gradientAlpha: string
  outerRing: string | undefined
} {
  const raw = normalizeHex(hex)
  const rgb = parseHex(raw)
  const muted = rgb ? isMutedColour(rgb) : false
  const colour = displayColour(raw)

  return {
    colour,
    gradientAlpha: muted ? '66' : '40',
    outerRing: muted ? '0 0 0 1px rgba(255,255,255,0.18)' : undefined,
  }
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const delta = max - min

  if (delta === 0) return { h: 0, s: 0, l }

  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

  let h: number
  if (max === r) h = ((g - b) / delta) % 6
  else if (max === g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4

  h *= 60
  if (h < 0) h += 360

  return { h, s, l }
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

const GRAY_SATURATION_THRESHOLD = 0.15

/**
 * Ordena equipos de forma que colores parecidos queden espaciados entre sí.
 * Los colores casi grises/blancos (baja saturación) se tratan aparte: el matiz
 * no es confiable para distinguirlos, así que se reparten a intervalos parejos
 * entre los equipos de color, para que nunca queden dos grises juntos.
 */
export function spreadTeamsByColour<T extends { colour: string }>(teams: T[]): T[] {
  const n = teams.length
  if (n <= 2) return teams

  const withHsl = teams.map((t) => ({ team: t, ...hexToHsl(t.colour) }))

  const colourful = withHsl.filter((t) => t.s >= GRAY_SATURATION_THRESHOLD).sort((a, b) => a.h - b.h)
  const grayscale = withHsl.filter((t) => t.s < GRAY_SATURATION_THRESHOLD).sort((a, b) => a.l - b.l)

  const spreadColourful = (() => {
    const m = colourful.length
    if (m <= 2) return colourful.map((x) => x.team)
    let step = Math.floor(m / 2)
    while (gcd(step, m) !== 1) step++
    const result: typeof colourful = []
    let idx = 0
    for (let i = 0; i < m; i++) {
      result.push(colourful[idx])
      idx = (idx + step) % m
    }
    return result.map((x) => x.team)
  })()

  if (grayscale.length === 0) return spreadColourful

  const result: T[] = [...spreadColourful]
  grayscale.forEach((g, i) => {
    const position = Math.round(((i + 1) * (result.length + 1)) / (grayscale.length + 1))
    result.splice(Math.min(position, result.length), 0, g.team)
  })

  return result
}