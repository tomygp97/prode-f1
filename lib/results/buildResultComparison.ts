import { UserLeague } from "../api/leagues"
import { Prediction } from "../api/predictions"
import { RaceDriverResultFromApi, RaceResultFromApi } from "../api/races"

/**
 * Qué tan cerca estuvo cada parte de la predicción. Es solo visual:
 * los puntos de cada categoría los calcula y los devuelve el back.
 */
export type MatchState = "exact" | "near" | "miss"

export type OrderRow = {
    position: number
    predictedDriverId: string | null
    actualDriverId: string | null
    state: MatchState | null // null si no hay predicción
}

export type FactorComparison<T> = {
    predicted: T | null
    actual: T
    state: MatchState | null
}

export type ResultComparison = {
    order: OrderRow[]
    pole: FactorComparison<string>
    safetyCar: FactorComparison<boolean>
    dnf: FactorComparison<number>
    trackedDriver: (FactorComparison<number | null> & { driverId: string }) | null
    counts: { exact: number; near: number }
}

type BuildResultComparisonParams = {
    league: Pick<UserLeague["league"], "predictionSlots" | "trackedDriverId">
    prediction: Prediction | null
    result: RaceResultFromApi
    driverResults: RaceDriverResultFromApi[]
}

function stateByDistance(predicted: number, actual: number | null | undefined): MatchState {
    if (actual == null) return "miss"
    const diff = Math.abs(predicted - actual)
    if (diff === 0) return "exact"
    if (diff === 1) return "near"
    return "miss"
}

export function buildResultComparison({
    league,
    prediction,
    result,
    driverResults,
}: BuildResultComparisonParams): ResultComparison {
    const positionByDriverId = new Map(
        driverResults
            .filter((r) => r.position !== null)
            .map((r) => [r.driverId, r.position as number]),
    )
    const driverIdByPosition = new Map(
        [...positionByDriverId].map(([driverId, position]) => [position, driverId]),
    )

    const order: OrderRow[] = Array.from({ length: league.predictionSlots }, (_, index) => {
        const position = index + 1
        const predictedDriverId = prediction?.predictedOrder[index] ?? null
        return {
            position,
            predictedDriverId,
            actualDriverId: driverIdByPosition.get(position) ?? null,
            state: predictedDriverId
                ? stateByDistance(position, positionByDriverId.get(predictedDriverId))
                : null,
        }
    })

    const trackedDriverId = league.trackedDriverId
    const trackedActual = trackedDriverId ? positionByDriverId.get(trackedDriverId) ?? null : null
    const trackedPredicted = prediction?.trackedDriverPosition ?? null

    return {
        order,
        pole: {
            predicted: prediction?.predictedPoleDriverId ?? null,
            actual: result.poleDriverId,
            state: prediction
                ? prediction.predictedPoleDriverId === result.poleDriverId ? "exact" : "miss"
                : null,
        },
        safetyCar: {
            predicted: prediction?.safetyCar ?? null,
            actual: result.safetyCar,
            state: prediction ? (prediction.safetyCar === result.safetyCar ? "exact" : "miss") : null,
        },
        dnf: {
            predicted: prediction?.dnfCount ?? null,
            actual: result.dnfCount,
            state: prediction ? stateByDistance(prediction.dnfCount, result.dnfCount) : null,
        },
        trackedDriver: trackedDriverId
            ? {
                driverId: trackedDriverId,
                predicted: trackedPredicted,
                actual: trackedActual,
                state: trackedPredicted !== null ? stateByDistance(trackedPredicted, trackedActual) : null,
            }
            : null,
        counts: {
            exact: order.filter((row) => row.state === "exact").length,
            near: order.filter((row) => row.state === "near").length,
        },
    }
}
