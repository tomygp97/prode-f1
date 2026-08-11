export type Team = {
    id: string
    name: string
    color: string
  }
  
  export type Driver = {
    id: string
    number: number
    firstName: string
    lastName: string
    code: string
    teamId: string
    country: string
    flag: string
  }
  
  export const teams: Team[] = [
    { id: "rb", name: "Red Bull Racing", color: "#3671C6" },
    { id: "mclaren", name: "McLaren", color: "#FF8000" },
    { id: "ferrari", name: "Ferrari", color: "#E8002D" },
    { id: "mercedes", name: "Mercedes", color: "#27F4D2" },
    { id: "aston", name: "Aston Martin", color: "#229971" },
    { id: "alpine", name: "Alpine", color: "#0093CC" },
    { id: "williams", name: "Williams", color: "#64C4FF" },
    { id: "rbf1", name: "RB", color: "#6692FF" },
    { id: "haas", name: "Haas", color: "#B6BABD" },
    { id: "sauber", name: "Kick Sauber", color: "#52E252" },
  ]
  
  export const drivers: Driver[] = [
    { id: "ver", number: 1, firstName: "Max", lastName: "Verstappen", code: "VER", teamId: "rb", country: "Países Bajos", flag: "🇳🇱" },
    { id: "nor", number: 4, firstName: "Lando", lastName: "Norris", code: "NOR", teamId: "mclaren", country: "Reino Unido", flag: "🇬🇧" },
    { id: "pia", number: 81, firstName: "Oscar", lastName: "Piastri", code: "PIA", teamId: "mclaren", country: "Australia", flag: "🇦🇺" },
    { id: "lec", number: 16, firstName: "Charles", lastName: "Leclerc", code: "LEC", teamId: "ferrari", country: "Mónaco", flag: "🇲🇨" },
    { id: "ham", number: 44, firstName: "Lewis", lastName: "Hamilton", code: "HAM", teamId: "ferrari", country: "Reino Unido", flag: "🇬🇧" },
    { id: "rus", number: 63, firstName: "George", lastName: "Russell", code: "RUS", teamId: "mercedes", country: "Reino Unido", flag: "🇬🇧" },
    { id: "ant", number: 12, firstName: "Andrea Kimi", lastName: "Antonelli", code: "ANT", teamId: "mercedes", country: "Italia", flag: "🇮🇹" },
    { id: "alo", number: 14, firstName: "Fernando", lastName: "Alonso", code: "ALO", teamId: "aston", country: "España", flag: "🇪🇸" },
    { id: "str", number: 18, firstName: "Lance", lastName: "Stroll", code: "STR", teamId: "aston", country: "Canadá", flag: "🇨🇦" },
    { id: "col", number: 43, firstName: "Franco", lastName: "Colapinto", code: "COL", teamId: "alpine", country: "Argentina", flag: "🇦🇷" },
    { id: "gas", number: 10, firstName: "Pierre", lastName: "Gasly", code: "GAS", teamId: "alpine", country: "Francia", flag: "🇫🇷" },
    { id: "alb", number: 23, firstName: "Alex", lastName: "Albon", code: "ALB", teamId: "williams", country: "Tailandia", flag: "🇹🇭" },
    { id: "sai", number: 55, firstName: "Carlos", lastName: "Sainz", code: "SAI", teamId: "williams", country: "España", flag: "🇪🇸" },
    { id: "tsu", number: 22, firstName: "Yuki", lastName: "Tsunoda", code: "TSU", teamId: "rbf1", country: "Japón", flag: "🇯🇵" },
    { id: "had", number: 6, firstName: "Isack", lastName: "Hadjar", code: "HAD", teamId: "rbf1", country: "Francia", flag: "🇫🇷" },
    { id: "oco", number: 31, firstName: "Esteban", lastName: "Ocon", code: "OCO", teamId: "haas", country: "Francia", flag: "🇫🇷" },
    { id: "bea", number: 87, firstName: "Oliver", lastName: "Bearman", code: "BEA", teamId: "haas", country: "Reino Unido", flag: "🇬🇧" },
    { id: "hul", number: 27, firstName: "Nico", lastName: "Hülkenberg", code: "HUL", teamId: "sauber", country: "Alemania", flag: "🇩🇪" },
    { id: "bor", number: 5, firstName: "Gabriel", lastName: "Bortoleto", code: "BOR", teamId: "sauber", country: "Brasil", flag: "🇧🇷" },
    { id: "law", number: 30, firstName: "Liam", lastName: "Lawson", code: "LAW", teamId: "rbf1", country: "Nueva Zelanda", flag: "🇳🇿" },
  ]
  
  export function getDriver(id: string): Driver {
    return drivers.find((d) => d.id === id) as Driver
  }
  
  export function getTeam(id: string): Team {
    return teams.find((t) => t.id === id) as Team
  }
  
  export function driverTeam(driverId: string): Team {
    return getTeam(getDriver(driverId).teamId)
  }
  
  export function fullName(d: Driver): string {
    return `${d.firstName} ${d.lastName}`
  }
  
  export type GrandPrix = {
    id: string
    round: number
    name: string
    circuit: string
    city: string
    country: string
    flag: string
    date: string // ISO
    status: "abiertas" | "cerradas"
  }
  
  export const nextGP: GrandPrix = {
    id: "monza",
    round: 16,
    name: "GP de Italia",
    circuit: "Autodromo Nazionale Monza",
    city: "Monza",
    country: "Italia",
    flag: "🇮🇹",
    date: "2026-06-21T13:00:00Z",
    status: "abiertas",
  }
  
  export type LeagueMember = {
    id: string
    name: string
    username: string
    points: number
    raceWins: number
    trend: "up" | "down" | "same"
    isMe?: boolean
  }
  
  export const league = {
    name: "Los Pibes de la F1",
    season: "2026",
    inviteCode: "PRODE-9F2K",
    members: [
      { id: "u1", name: "Tomás Giménez", username: "tomi_vroom", points: 412, raceWins: 5, trend: "same" as const },
      { id: "u2", name: "Juan Cruz Pérez", username: "jcp17", points: 389, raceWins: 4, trend: "up" as const },
      { id: "u3", name: "Martín Sosa", username: "tincho_f1", points: 366, raceWins: 3, trend: "down" as const },
      { id: "me", name: "Vos", username: "vos", points: 341, raceWins: 2, trend: "up" as const, isMe: true },
      { id: "u5", name: "Lucía Romero", username: "luchi", points: 318, raceWins: 1, trend: "down" as const },
      { id: "u6", name: "Nico Fernández", username: "nicof", points: 305, raceWins: 1, trend: "up" as const },
      { id: "u7", name: "Sofía Aguirre", username: "sofi_a", points: 287, raceWins: 0, trend: "same" as const },
      { id: "u8", name: "Pedro Molina", username: "pedrom", points: 264, raceWins: 0, trend: "down" as const },
      { id: "u9", name: "Camila Díaz", username: "cami", points: 241, raceWins: 0, trend: "up" as const },
      { id: "u10", name: "Bruno Castro", username: "bruno", points: 219, raceWins: 0, trend: "down" as const },
    ] as LeagueMember[],
  }
  
  export const myRank = 4
  export const myPoints = 341
  
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
  
  // Results screen data (official result of last GP)
  export const officialResult = {
    gpName: "GP de Italia",
    pole: "nor",
    top5: ["nor", "pia", "lec", "ver", "ham"],
    safetyCar: true,
    dnf: 3,
    colapinto: 11,
  }
  
  export const myPrediction = {
    pole: "nor",
    top5: ["nor", "ver", "lec", "pia", "rus"],
    safetyCar: true,
    dnf: 3,
    colapinto: 11,
  }
  
  export type ScoreBreakdownItem = {
    category: string
    detail: string
    points: number
  }
  
  export const scoreBreakdown: ScoreBreakdownItem[] = [
    { category: "Pole Position", detail: "Norris — correcto", points: 5 },
    { category: "Top 5", detail: "2 exactos + 2 pilotos correctos", points: 14 },
    { category: "Safety Car", detail: "Sí — correcto", points: 3 },
    { category: "DNF", detail: "3 abandonos — exacto", points: 5 },
    { category: "Franco Colapinto", detail: "P11 — exacto", points: 10 },
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
  