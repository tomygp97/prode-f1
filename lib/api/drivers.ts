import { Driver } from "../f1-data";
import { api } from "./client";


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
    const data = await api.get<DriverFromApi[]>("/drivers")
    return data.map(toDriver)
}

//! Verificar
// export async function fetchDriverById2(driverId: string): Promise<Driver> {
//     const res = await fetch(`${apiurl}/drivers/${driverId}`)
//     if (!res.ok) {
//         throw new Error(`GET /drivers/${driverId} -> ${res.status}`)
//     }
//     const data: DriverFromApi = await res.json()
//     return toDriver(data)
// }

export async function fetchDriverById(driverId: string): Promise<Driver> {
    const data = await api.get<DriverFromApi>(`/drivers/${driverId}`)
    return toDriver(data)
}