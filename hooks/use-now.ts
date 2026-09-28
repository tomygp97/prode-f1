"use client"

import { useEffect, useState } from "react"

/** Hora actual que se actualiza sola (para fases y cuentas regresivas, sin pedir nada al back). */
export function useNow(intervalMs: number = 60_000): Date {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), intervalMs)
        return () => clearInterval(timer)
    }, [intervalMs])

    return now
}
