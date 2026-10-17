import { Skeleton, SkeletonCard, SkeletonRegion, SkeletonRows } from "@/components/ui/skeleton"

// Esqueletos con la forma de cada pantalla, para mostrar mientras cargan los datos

/** Inicio: tarjeta del próximo GP (título, nombre, fecha y cuenta regresiva). */
export function NextGpCardSkeleton() {
  return (
    <SkeletonRegion label="Cargando próximo GP…">
      <SkeletonCard className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-4 gap-2 pt-1">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
      </SkeletonCard>
    </SkeletonRegion>
  )
}

/** Inicio: resumen de la liga (encabezado con posición y top 5). */
export function LeagueSummarySkeleton({ rowsOnly = false }: { rowsOnly?: boolean }) {
  if (rowsOnly) {
    return (
      <SkeletonRegion label="Cargando ranking…">
        <SkeletonRows count={5} />
      </SkeletonRegion>
    )
  }
  return (
    <SkeletonRegion label="Cargando tu liga…" className="space-y-3">
      <SkeletonCard className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-8 w-12" />
      </SkeletonCard>
      <SkeletonRows count={5} />
    </SkeletonRegion>
  )
}

/** Predicción: título, pole, posiciones, Safety Car / DNF y botón de guardar. */
export function PredictionFormSkeleton({ slots = 5 }: { slots?: number }) {
  return (
    <SkeletonRegion label="Cargando predicción…" className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <SkeletonCard className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </SkeletonCard>
      <SkeletonCard className="space-y-2">
        <Skeleton className="mb-1 h-4 w-32" />
        {Array.from({ length: slots }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-6" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
        ))}
      </SkeletonCard>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </SkeletonRegion>
  )
}

/** Lista de miembros de la liga (predicciones de la carrera en curso). */
export function LeagueRowsSkeleton({ count = 4, label = "Cargando…" }: { count?: number; label?: string }) {
  return (
    <SkeletonRegion label={label}>
      <SkeletonRows count={count} />
    </SkeletonRegion>
  )
}

/** Resultados: encabezado, banner de puntos, comparación en dos columnas y factores. */
export function ResultsSkeleton() {
  const column = (
    <SkeletonCard className="space-y-2 p-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-3 w-10" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-3 w-12" />
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </SkeletonCard>
  )
  return (
    <SkeletonRegion label="Cargando resultados…" className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-3/4" />
        </div>
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        {column}
        {column}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </SkeletonRegion>
  )
}

/** Ranking: podio de 3 + tabla. */
export function RankingSkeleton() {
  return (
    <SkeletonRegion label="Cargando ranking…" className="space-y-5">
      <div className="grid grid-cols-3 items-end gap-3">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <SkeletonRows count={5} />
    </SkeletonRegion>
  )
}

/** Ligas: tarjetas de "mis ligas". */
export function LeaguesListSkeleton() {
  return (
    <SkeletonRegion label="Cargando ligas…" className="space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <SkeletonCard key={i} className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </SkeletonCard>
      ))}
    </SkeletonRegion>
  )
}

/** Perfil: grilla de 4 estadísticas. */
export function ProfileStatsSkeleton() {
  return (
    <SkeletonRegion label="Cargando estadísticas…" className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }, (_, i) => (
        <SkeletonCard key={i} className="space-y-2">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-7 w-14" />
          <Skeleton className="h-3 w-24" />
        </SkeletonCard>
      ))}
    </SkeletonRegion>
  )
}
