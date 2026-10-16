"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useMe } from "@/hooks/use-me"
import { PasswordResetLinkTool } from "@/components/admin/password-reset-link-tool"
import { Skeleton, SkeletonCard, SkeletonRegion } from "@/components/ui/skeleton"

/**
 * Panel de admin de la APP (users.app_role = ADMIN, los devs): no tiene que ver con ser
 * admin de una liga. Las herramientas nuevas se suman como tarjetas.
 */
export function Admin() {
  const { token } = useAuth()
  const { isAppAdmin, isLoading } = useMe(token)
  const router = useRouter()

  // Un usuario común que entra a /admin a mano vuelve al inicio (el back igual responde 403)
  useEffect(() => {
    if (!isLoading && !isAppAdmin) router.replace("/home")
  }, [isLoading, isAppAdmin, router])

  if (isLoading || !isAppAdmin) {
    return (
      <SkeletonRegion label="Cargando panel de admin…" className="space-y-5 px-4 py-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-56" />
        <SkeletonCard className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </SkeletonCard>
      </SkeletonRegion>
    )
  }

  return (
    <div className="space-y-5 px-4 py-5">
      <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        <ArrowLeft className="size-4" /> Volver al perfil
      </Link>
      <div>
        <h1 className="flex items-center gap-2 font-heading text-2xl font-bold uppercase leading-tight">
          <ShieldCheck className="size-6 text-arg" /> Panel de admin
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">Herramientas para administrar la app.</p>
      </div>

      <PasswordResetLinkTool />
    </div>
  )
}
