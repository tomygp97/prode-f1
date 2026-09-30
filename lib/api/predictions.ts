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

// Puntos por categoría, calculados por el back (calculate-race-scores.use-case.ts)
export interface PredictionScoreBreakdown {
    positions: number
    pole: number
    safetyCar: number
    dnfCount: number
    trackedDriver: number
}

export interface PredictionScore {
    id: string
    predictionId: string
    pointsBreakdown: PredictionScoreBreakdown
    totalPoints: number
    calculatedAt: string
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

// null si no hay predicción o si los puntos todavía no se calcularon
export function fetchMyPredictionScore(
    token: string,
    leagueId: string,
    raceId: string,
): Promise<PredictionScore | null> {
    return api.get<PredictionScore | null>(
        `/leagues/${leagueId}/races/${raceId}/predictions/score`,
        token
    )
}