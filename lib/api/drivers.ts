import { Driver } from "../f1-data";
import { api } from "./client";

export type DriverFromApi = {
    id: string,
    name: string,
    acronym: string,
    driverNumber: number,
    seasonId: string,
    teamId: string,
}

export function toDriver(data: DriverFromApi): Driver {
    return {
        id: data.id,
        name: data.name,
        acronym: data.acronym,
        driverNumber: data.driverNumber,
        teamId: data.teamId,
    }
}

export async function fetchDrivers(): Promise<Driver[]> {
    const data = await api.get<DriverFromApi[]>("/drivers")
    return data.map(toDriver)
}

export async function fetchDriverById(driverId: string): Promise<Driver> {
    const data = await api.get<DriverFromApi>(`/drivers/${driverId}`)
    return toDriver(data)
}