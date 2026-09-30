"use client"

import { fetchTeams } from "@/lib/api/teams";
import { Team } from "@/lib/f1-data";
import { useEffect, useState } from "react";

export function useTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        let cancelled = false;

        fetchTeams()
        .then((data) => {
            if (!cancelled) {
                setTeams(data)
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
            cancelled =  true
        }
    }, [])
    return { teams, isLoading, error }
}