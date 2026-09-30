"use client"

import { Check, Copy, Share2 } from "lucide-react"
import { useCopy } from "@/hooks/use-copy"
import { inviteLink } from "@/lib/leagues/invite"

// Código + link de invitación. Con Web Share (celular) comparte directo; si no, copia el link.
export function InviteShare({ leagueName, inviteCode }: { leagueName: string; inviteCode: string }) {
  const { copiedKey, copy } = useCopy()
  const link = inviteLink(inviteCode)

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Prode F1 — ${leagueName}`,
          text: `Sumate a mi liga "${leagueName}" en el Prode F1. Código: ${inviteCode}`,
          url: link,
        })
        return
      } catch {
        // cancelado por el usuario o no disponible: copiamos el link
      }
    }
    copy(link, "link")
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">Código de invitación</p>
        <button
          type="button"
          onClick={() => copy(inviteCode, "code")}
          className="flex w-full items-center justify-between rounded-xl border border-dashed border-border bg-background px-4 py-3"
          aria-label="Copiar código"
        >
          <span className="font-mono text-lg font-bold tracking-[0.2em]">{inviteCode}</span>
          {copiedKey === "code" ? <Check className="size-4 text-arg" /> : <Copy className="size-4 text-muted-foreground" />}
        </button>
      </div>

      <div>
        <p className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">Link para compartir</p>
        <div className="flex gap-2">
          <span className="flex-1 truncate rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground">
            {link}
          </span>
          <button
            type="button"
            onClick={share}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-secondary px-3 text-sm font-medium"
          >
            {copiedKey === "link" ? <Check className="size-4 text-arg" /> : <Share2 className="size-4" />}
            {copiedKey === "link" ? "Copiado" : "Compartir"}
          </button>
        </div>
      </div>
    </div>
  )
}
