import { LeagueSwitcherButton } from "@/components/prode/active-league-switcher"
import { GrandPrix } from "@/lib/f1-data"

export function ResultsHeader({ gp }: { gp: GrandPrix }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <span className="font-mono text-xs text-muted-foreground">Fecha {gp.round} · Finalizado</span>
        <h1 className="font-heading text-2xl font-bold uppercase leading-tight">
          Resultados {gp.flag} {gp.name}
        </h1>
      </div>
      {/* El puntaje depende de la liga: el switcher solo vive en esta pantalla */}
      <div className="shrink-0 pt-1">
        <LeagueSwitcherButton />
      </div>
    </div>
  )
}
