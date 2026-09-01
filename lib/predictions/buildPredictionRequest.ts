import { UserLeague } from "../api/leagues"
import { SubmitPredictionRequest } from "../api/predictions"
import { TrackedDriverItem } from "./buildTrackedDriverItems"


type BuildPredictionRequestParams = {
    league: UserLeague["league"]
    predictedOrder: (string | undefined)[]
    pole: string | undefined
    safetyCar: boolean | null
    dnf: number
    trackedDriverItems: TrackedDriverItem[]
}

export function buildPredictionRequest({
    league,
    predictedOrder,
    pole,
    safetyCar,
    dnf,
    trackedDriverItems,
}: BuildPredictionRequestParams): SubmitPredictionRequest | null {
    if (!pole) {
        return null
    }

    if (safetyCar === null) {
        return null
    }

    const leaguePredictedOrder = predictedOrder.slice(0, league.predictionSlots)

    if (
        leaguePredictedOrder.length !== league.predictionSlots ||
        leaguePredictedOrder.some((driverId) => !driverId)
    ) {
        return null
    }

    const body: SubmitPredictionRequest = {
        predictedOrder: leaguePredictedOrder as string[],
        predictedPoleDriverId: pole,
        safetyCar,
        dnfCount: dnf,
    }

    if (league.trackedDriverId) {
        const trackedDriver = trackedDriverItems.find(
            (item) => item.driver.id === league.trackedDriverId
        )

        if (!trackedDriver || trackedDriver.position === null) {
            return null
        }

        body.trackedDriverPosition = trackedDriver.position
    }
    return body
}