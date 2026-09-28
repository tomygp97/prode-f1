export type Team = {
    id: string
    name: string
    colour: string
  }
  
  export type Driver = {
    id: string
    driverNumber: number
    name: string
    acronym: string
    teamId: string
  }
  
  
  
  export function fullName(d: Driver): string {
    return `${d.name}`
  }

  export function findTeam(teams: Team[], teamId: string): Team | undefined {
    return teams.find((t) => t.id === teamId)
  }
  
  export type GrandPrix = {
    id: string
    round: number
    name: string
    circuit: string
    country: string
    flag: string
    date: string // ISO
    status: "abiertas" | "cerradas"
  }
