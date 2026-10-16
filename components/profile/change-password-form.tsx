"use client"

import { useState } from "react"
import { AlertCircle, Check, KeyRound, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { changePassword } from "@/lib/api/auth"
import { passwordErrorMessage, validateNewPassword } from "@/lib/auth/password"
import { PasswordInput } from "@/components/auth/password-input"

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"

/** "Cambiar contraseña" en Perfil: se despliega en el lugar y pide la actual + la nueva (dos veces). */
export function ChangePasswordForm() {
  const { token } = useAuth()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState("")
  const [password, setPassword] = useState("")
  const [repeat, setRepeat] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [done, setDone] = useState(false)

  function reset() {
    setCurrent("")
    setPassword("")
    setRepeat("")
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    const invalid = validateNewPassword(password, repeat)
    if (invalid) {
      setError(invalid)
      return
    }
    if (password === current) {
      setError("La nueva contraseña tiene que ser distinta de la actual.")
      return
    }

    setError(null)
    setIsSaving(true)
    try {
      await changePassword(token, { currentPassword: current, newPassword: password })
      reset()
      setOpen(false)
      setDone(true)
    } catch (err) {
      setError(passwordErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (!open) {
    return (
      <div className="space-y-2">
        {done && (
          <p className="flex items-center gap-1.5 text-sm text-arg">
            <Check className="size-4" /> Contraseña actualizada.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setOpen(true)
            setDone(false)
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          <KeyRound className="size-4" /> Cambiar contraseña
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="current-password" className="text-xs text-muted-foreground">Contraseña actual</label>
        <PasswordInput
          id="current-password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="new-password" className="text-xs text-muted-foreground">Nueva contraseña</label>
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="repeat-password" className="text-xs text-muted-foreground">Repetí la nueva contraseña</label>
        <PasswordInput
          id="repeat-password"
          autoComplete="new-password"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5 text-sm text-primary">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            reset()
            setOpen(false)
          }}
          className="rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground disabled:cursor-wait disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Guardando…
            </>
          ) : (
            "Guardar"
          )}
        </button>
      </div>
    </form>
  )
}
