import { Driver } from "../f1-data";


const apiurl = process.env.NEXT_PUBLIC_API_URL;
if (!apiurl) {
    throw new Error("NEXT_PUBLIC_API_URL no está definida")
}

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
    const res = await fetch(`${apiurl}/drivers`);
    if (!res.ok) {
        throw new Error(`GET /drivers -> ${res.status}`)
    }
    const data: DriverFromApi[] = await res.json();
    return data.map(toDriver)
}

export async function fetchDriverById(driverId: string): Promise<Driver> {
    const res = await fetch(`${apiurl}/drivers/${driverId}`)
    if (!res.ok) {
        throw new Error(`GET /drivers/${driverId} -> ${res.status}`)
    }
    const data: DriverFromApi = await res.json()
    return toDriver(data)
}