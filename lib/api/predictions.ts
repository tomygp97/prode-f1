import { api } from "./client";

export interface Prediction {
    id: string
    userId: string
    leagueId: string
    raceId: string
    predictedOrder: string[]
    predictedPoleDriverId: string
    trackedDriverPosition: number | null
    safetyCar: boolean
    dnfCount: number
  }

export interface SubmitPredictionRequest {
    predictedOrder: string[]
    predictedPoleDriverId: string
    trackedDriverPosition?: number
    safetyCar: boolean
    dnfCount: number
}

export function submitPrediction(
    token: string,
    leagueId: string,
    raceId: string,
    body: SubmitPredictionRequest,
): Promise<Prediction> {
    return api.post<Prediction>(
        `/leagues/${leagueId}/races/${raceId}/predictions`,
        body,
        token
    )
}

export function fetchMyPrediction(
    token: string,
    leagueId: string,
    raceId: string,
): Promise<Prediction | null> {
    return api.get<Prediction | null>(
        `/leagues/${leagueId}/races/${raceId}/predictions/me`,
        token
    )
}