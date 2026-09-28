/**
 * Puntos por acierto. COPIA de `POINTS` en el back:
 * prode-f1-backend/src/application/ranking/calculate-race-scores/calculate-race-scores.use-case.ts
 * Si cambia uno, cambiar el otro (el back es la fuente de verdad: es el que calcula).
 */
export const SCORING_POINTS = {
  WINNER_EXACT: 25,
  POSITION_EXACT: 8,
  POSITION_OFF_BY_ONE: 3,
  POLE_EXACT: 20,
  SAFETY_CAR_EXACT: 5,
  DNF_EXACT: 10,
  DNF_OFF_BY_ONE: 5,
  TRACKED_DRIVER_EXACT: 10,
  TRACKED_DRIVER_OFF_BY_ONE: 5,
} as const
