"use client"

import { BottomNav } from "@/components/prode/bottom-nav"
import { AppHeader } from "@/components/prode/app-header"
import { LeagueProvider } from "@/context/league-context"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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