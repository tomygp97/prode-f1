"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/prode/bottom-nav"
import { AppHeader } from "@/components/prode/app-header"
import { LeagueProvider } from "@/context/league-context"
import { useAuth } from "@/context/auth-context"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  if (isLoading || !user) {
    return null // o un spinner, si querés algo visual mientras carga
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