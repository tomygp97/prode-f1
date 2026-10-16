"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/prode/bottom-nav"
import { AppHeader } from "@/components/prode/app-header"
import { LeagueProvider } from "@/context/league-context"
import { useAuth } from "@/context/auth-context"
import { withNext } from "@/lib/auth/redirect"
import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      // Se guarda a dónde quería ir (ej. un link de invitación) para volver después del login
      const next = window.location.pathname + window.location.search
      router.replace(withNext("/login", next === "/home" ? null : next))
    }
  }, [isLoading, user, router])

  // Mientras se lee la sesión (o se redirige al login): la estructura de la app, sin pantalla negra
  if (isLoading || !user) {
    return (
      <div className="mx-auto min-h-screen max-w-md bg-background pb-20">
        <AppHeader />
        <SkeletonRegion className="space-y-4 px-4 py-5">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </SkeletonRegion>
        <BottomNav />
      </div>
    )
  }

  return (
    <LeagueProvider>
      <div className="mx-auto min-h-screen max-w-md bg-background pb-20">
        <AppHeader />

        <main className="animate-in fade-in duration-300">
          {children}
        </main>

        <BottomNav />
      </div>
    </LeagueProvider>
  )
}