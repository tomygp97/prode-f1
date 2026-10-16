import { cn } from "@/lib/utils"

/** Bloque gris que late mientras carga. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-secondary", className)} />
}

/**
 * Contenedor de un esqueleto: avisa a los lectores de pantalla que se está cargando
 * (los bloques de adentro son decorativos).
 */
export function SkeletonRegion({
  label = "Cargando…",
  className,
  children,
}: {
  label?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

/** Misma forma que las tarjetas de la app (rounded-2xl, borde, bg-card). */
export function SkeletonCard({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-4", className)}>{children}</div>
}

/** Filas de tabla: avatar + nombre + puntos (Ranking, resumen de liga, predicciones de la liga). */
export function SkeletonRows({ count, className }: { count: number; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={cn("flex items-center gap-3 px-4 py-2.5", i !== count - 1 && "border-b border-border")}
        >
          <Skeleton className="h-4 w-5" />
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-10" />
        </div>
      ))}
    </div>
  )
}
