import Link from "next/link"
import { cn } from "@/lib/utils"

export type ScoreBannerState =
  | { kind: "score"; total: number }
  | { kind: "pending" }
  | { kind: "no-prediction" }
  | { kind: "no-league" }

const copy: Record<Exclude<ScoreBannerState["kind"], "score">, { title: string; detail: string }> = {
  pending: {
    title: "Puntos en cálculo",
    detail: "Los resultados ya están; tus puntos se calculan en la próxima hora.",
  },
  "no-prediction": {
    title: "No participaste",
    detail: "No cargaste predicción para esta fecha en esta liga.",
  },
  "no-league": {
    title: "Sin liga",
    detail: "Unite a una liga para sumar puntos con tus predicciones.",
  },
}

export function ScoreBanner({ state }: { state: ScoreBannerState }) {
  if (state.kind === "score") {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-arg/40 bg-gradient-to-r from-arg/15 to-transparent p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Total fecha</p>
        <span className="font-heading text-4xl font-bold text-arg">+{state.total}</span>
      </div>
    )
  }

  const { title, detail } = copy[state.kind]
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4",
        state.kind === "pending" && "border-arg/40",
      )}
    >
      <p className="font-heading text-base font-bold uppercase">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      {state.kind === "no-league" && (
        <Link
          href="/leagues"
          className="mt-3 inline-block rounded-xl bg-primary px-4 py-2 font-heading text-sm font-bold uppercase text-primary-foreground"
        >
          Ir a Ligas
        </Link>
      )}
    </div>
  )
}
