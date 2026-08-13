import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
