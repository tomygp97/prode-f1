import { scoring } from "@/lib/f1-data";
import { Info } from "lucide-react";


export function ScoringSummary() {
    return(
        <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Info className="size-4 text-muted-foreground" />
          <h2 className="font-heading text-base font-bold uppercase">Resumen de Puntajes</h2>
        </div>
        <ul className="divide-y divide-border">
          {scoring.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="shrink-0 rounded-md bg-primary/15 px-2 py-0.5 font-heading text-sm font-bold text-primary">
                +{s.points}
              </span>
            </li>
          ))}
        </ul>
      </section>
    )
}