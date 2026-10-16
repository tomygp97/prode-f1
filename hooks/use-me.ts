"use client"

import { useEffect, useState } from "react"
import { fetchMe, Me } from "@/lib/api/auth"

type Loaded = { token: string; me: Me | null; error: string | null }

// Usuario logueado según el back (incluye si es admin de la app)
export function useMe(token: string | null | undefined) {
    // Se guarda junto al token que lo pidió: al cambiar de sesión no se ve el dato anterior
    const [loaded, setLoaded] = useState<Loaded | null>(null)

    useEffect(() => {
        if (!token) return

        let cancelled = false

        fetchMe(token)
            .then((me) => {
                if (!cancelled) setLoaded({ token, me, error: null })
            })
            .catch((err) => {
                if (!cancelled) {
                    setLoaded({ token, me: null, error: err instanceof Error ? err.message : "No se pudo cargar tu usuario" })
                }
            })

        return () => {
            cancelled = true
        }
    }, [token])

    const current = token && loaded?.token === token ? loaded : null
    return {
        me: current?.me ?? null,
        isAppAdmin: current?.me?.isAppAdmin ?? false,
        isLoading: Boolean(token) && !current,
        error: current?.error ?? null,
    }
}
