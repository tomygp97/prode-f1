"use client"

import { useState } from "react"
import { AlertCircle, Check, Copy, KeyRound, Loader2, MessageCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { createPasswordResetLink, PasswordResetLink } from "@/lib/api/auth"
import { passwordErrorMessage } from "@/lib/auth/password"
import { formatArgDateTime } from "@/lib/races/weekend"

/**
 * Link de un solo uso (24 h) para que alguien que olvidó su contraseña elija una nueva.
 * No hay envío de emails: el admin lo copia o lo manda por WhatsApp.
 */
export function PasswordResetLinkTool() {
  const { token } = useAuth()
  const [email, setEmail] = useState("")
  const [link, setLink] = useState<PasswordResetLink | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setError(null)
    setLink(null)
    setCopied(false)
    setIsCreating(true)
    try {
      setLink(await createPasswordResetLink(token, email.trim()))
    } catch (err) {
      setError(passwordErrorMessage(err))
    } finally {
      setIsCreating(false)
    }
  }

  async function copyLink() {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link.url)
      setCopied(true)
    } catch {
      setError("No se pudo copiar. Seleccioná el link y copialo a mano.")
    }
  }

  const expires = link ? formatArgDateTime(link.expiresAt) : null
  const whatsappText = link
    ? `Hola ${link.userName}! Con este link elegís una nueva contraseña para Prode F1 (sirve una sola vez y vence en 24 h): ${link.url}`
    : ""

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <KeyRound className="size-4" />
        </span>
        <div>
          <h2 className="font-heading text-base font-bold uppercase leading-tight">Restablecer contraseña</h2>
          <p className="text-xs text-muted-foreground">Link de un solo uso para quien olvidó su contraseña.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="email del usuario"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={isCreating}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:cursor-wait disabled:opacity-70"
        >
          {isCreating ? <Loader2 className="size-4 animate-spin" /> : null} Generar
        </button>
      </form>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5 text-sm text-primary">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {link && expires && (
        <div className="space-y-2 rounded-xl border border-arg/40 bg-arg/10 p-3">
          <p className="text-sm">
            Link para <span className="font-semibold">{link.userName}</span>, vale hasta el {expires.day} a las {expires.time}.
          </p>
          <p className="break-all rounded-lg bg-background px-2 py-1.5 font-mono text-xs text-muted-foreground">{link.url}</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              {copied ? <Check className="size-4 text-arg" /> : <Copy className="size-4" />} {copied ? "Copiado" : "Copiar"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2 text-sm font-semibold text-black"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
          <p className="text-xs text-muted-foreground">Si generás otro link para la misma persona, este deja de servir.</p>
        </div>
      )}
    </section>
  )
}
