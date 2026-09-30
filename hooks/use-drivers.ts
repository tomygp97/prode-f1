"use client"

import { fetchDrivers } from "@/lib/api/drivers";
import { Driver } from "@/lib/f1-data"
import { useEffect, useState } from "react"

export function useDrivers() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        let cancelled = false;

        fetchDrivers()
        .then((data) => {
            if (!cancelled) {
                setDrivers(data)
                setIsLoading(false)
            }
        })
        .catch((err) => {
            if (!cancelled) {
                setError(err instanceof Error ? err.message : "Error")
                setIsLoading(false)
            }
        })
        return () => {
            cancelled = true
        }
    }, [])
    return { drivers, isLoading, error }
}