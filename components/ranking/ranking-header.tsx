import { LeagueSwitcherButton } from "@/components/prode/active-league-switcher"

export function RankingHeader({ leagueName }: { leagueName?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-bold uppercase leading-tight">Ranking General</h1>
        <p className="truncate text-sm text-muted-foreground">{leagueName ?? "Sin liga seleccionada"}</p>
      </div>
      <LeagueSwitcherButton />
    </div>
  )
}
