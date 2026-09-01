"use client"

import { UserLeague } from "@/lib/api/leagues"
import { submitPrediction } from "@/lib/api/predictions"
import { buildPredictionRequest } from "@/lib/predictions/buildPredictionRequest"
import { TrackedDriverItem } from "@/lib/predictions/buildTrackedDriverItems"
import { useState } from "react"

type UseSavePredictionParams = {
    token: string | null
    raceId: string | undefined
    leagues: UserLeague[]
    predictedOrder: (string | undefined)[]
    pole: string | undefined
    safetyCar: boolean | null
    dnf: number
    trackedDriverItems: TrackedDriverItem[]
}

export function useSavePrediction({
    token,
    raceId,
    leagues,
    predictedOrder,
    pole,
    safetyCar,
    dnf,
    trackedDriverItems,
}: UseSavePredictionParams) {
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    async function savePrediction() {
        if (!token || !raceId) return

        try {
            setIsSaving(true)
            setSaved(false)

            const requests = leagues.map((userLeague) => {
                const league = userLeague.league

                const body = buildPredictionRequest({
                    league,
                    predictedOrder,
                    pole,
                    safetyCar,
                    dnf,
                    trackedDriverItems,
                })

                if (!body) {
                    throw new Error(`La predicción para la liga "${league.name}" esta incompleta`)
                }

                return submitPrediction(token, league.id, raceId, body)
            })

            await Promise.all(requests)

            setSaved(true)
        } catch (err) {
            console.error(err)
        } finally {
            setIsSaving(false)
        }
    }

    return {savePrediction, isSaving, saved}
}