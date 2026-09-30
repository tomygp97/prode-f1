"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Copia al portapapeles y marca cuál se copió por 1,5 s (para el ✓ del botón)
export function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current)
  }, [])

  const copy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard?.writeText(text)
    } catch {
      // sin permiso de portapapeles: no marcamos como copiado
      return
    }
    setCopiedKey(key)
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopiedKey(null), 1500)
  }, [])

  return { copiedKey, copy }
}
