import Link from "next/link"
import { ChevronRight, Trophy } from "lucide-react"
import { RaceFromApi, toGrandPrix } from "@/lib/api/races"

/** Aviso de resultados nuevos (se muestra hasta 24 h antes de la próxima qualy). */
export function ResultsReadyBanner({ race }: { race: RaceFromApi }) {
  const gp = toGrandPrix(race)

  return (
    <Link
      href="/results"
      className="flex items-center gap-3 rounded-2xl border border-arg/40 bg-gradient-to-r from-arg/15 to-transparent p-4 transition-colors hover:bg-arg/10"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-arg/20 text-arg">
        <Trophy className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-base font-bold uppercase leading-tight">Resultados disponibles</p>
        <p className="truncate text-xs text-muted-foreground">
          {gp.flag} {gp.name}: mirá cómo te fue y tus puntos
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-arg" />
    </Link>
  )
}
