import { StandingEntry } from "@/lib/api/ranking"
import { cn, initials } from "@/lib/utils"

function medalColorFor(rank: number) {
  if (rank === 1) return "#FFD700"
  if (rank === 2) return "#C0C0C0"
  return "#CD7F32"
}

// Alto del escalón según el lugar en el podio (no el rank: con empates dos pueden ser 1º)
const stepHeight = ["h-28", "h-20", "h-16"]

/**
 * Los 3 primeros de la tabla, en orden 2º-1º-3º. Se toman por posición en la lista
 * (ya viene ordenada) y se muestra su rank real, así los empates no dejan huecos.
 */
export function Podium({ standings }: { standings: StandingEntry[] }) {
  const top = standings.slice(0, 3)
  if (top.length === 0) return null

  const places = [1, 0, 2].filter((place) => place < top.length)

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-end justify-center gap-2">
        {places.map((place) => {
          const s = top[place]
          const colour = medalColorFor(s.rank)
          return (
            <div key={s.userId} className="flex flex-1 flex-col items-center">
              <div
                className="flex size-12 items-center justify-center rounded-full font-heading text-base font-bold text-black"
                style={{ backgroundColor: colour }}
              >
                {initials(s.userName)}
              </div>
              <p className="mt-1.5 max-w-full truncate text-xs font-semibold">{s.userName}</p>
              <p className="font-heading text-sm font-bold text-arg">{s.totalPoints}</p>
              <div
                className={cn("mt-2 flex w-full items-start justify-center rounded-t-lg pt-2", stepHeight[place])}
                style={{ background: `linear-gradient(180deg, ${colour}30, transparent)` }}
              >
                <span className="font-heading text-2xl font-bold" style={{ color: colour }}>
                  {s.rank}º
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
