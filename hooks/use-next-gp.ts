"use client"

import { fetchNextGP } from "@/lib/api/races";
import { GrandPrix } from "@/lib/f1-data";
import { useEffect, useState } from "react";

export function useNextGP() {
    const [nextGP, setNextGP] = useState<GrandPrix | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        let cancelled = false;

        fetchNextGP()
        .then((data) => {
          if (!cancelled) {
            setNextGP(data)
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
    return { nextGP, isLoading, error }
}