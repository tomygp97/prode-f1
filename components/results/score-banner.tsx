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

// Mismos estados vistos sobre la predicción de otro miembro de la liga
const otherCopy = (name: string): Record<"pending" | "no-prediction", { title: string; detail: string }> => ({
  pending: {
    title: "Puntos en cálculo",
    detail: `Los resultados ya están; los puntos de ${name} se calculan en la próxima hora.`,
  },
  "no-prediction": {
    title: "Sin predicción",
    detail: `${name} no cargó predicción para esta fecha.`,
  },
})

/** `name`: el banner es de otro miembro de la liga (sin nombre, es el mío). */
export function ScoreBanner({ state, name }: { state: ScoreBannerState; name?: string }) {
  if (state.kind === "score") {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-arg/40 bg-gradient-to-r from-arg/15 to-transparent p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Total fecha{name ? ` · ${name}` : ""}</p>
        <span className="font-heading text-4xl font-bold text-arg">+{state.total}</span>
      </div>
    )
  }

  const { title, detail } =
    name && state.kind !== "no-league" ? otherCopy(name)[state.kind] : copy[state.kind]
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
