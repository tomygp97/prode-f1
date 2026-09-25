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
  
  
  // Scoring reference
  export const scoring = [
    { label: "Pole Position correcta", points: 5 },
    { label: "Top 5 — posición exacta", points: 5 },
    { label: "Top 5 — piloto correcto, posición incorrecta", points: 2 },
    { label: "Safety Car correcto", points: 3 },
    { label: "DNF — cantidad exacta", points: 5 },
    { label: "Franco Colapinto — posición exacta", points: 10 },
    { label: "Campeón de Pilotos", points: 25 },
    { label: "Campeón de Constructores", points: 25 },
  ]
  
  export const profile = {
    name: "Vos",
    username: "@vos",
    totalPoints: 341,
    rank: 4,
    raceWins: 2,
    avgPerRace: 22.7,
    bestRace: { gp: "GP de Mónaco", points: 48 },
    racesPlayed: 15,
    history: [
      { round: 15, gp: "GP de Países Bajos", points: 31, position: 3 },
      { round: 14, gp: "GP de Hungría", points: 18, position: 6 },
      { round: 13, gp: "GP de Bélgica", points: 27, position: 2 },
      { round: 12, gp: "GP de Gran Bretaña", points: 12, position: 8 },
      { round: 11, gp: "GP de Austria", points: 22, position: 4 },
      { round: 10, gp: "GP de España", points: 37, position: 1 },
      { round: 9, gp: "GP de Canadá", points: 15, position: 7 },
      { round: 8, gp: "GP de Mónaco", points: 48, position: 1 },
    ],
  }
  