"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { BottomNav } from "@/components/prode/bottom-nav"
import { NavContext, type Screen } from "@/components/prode/nav-context"
import { Dashboard } from "@/components/prode/screens/dashboard"
import { Predictions } from "@/components/prode/screens/predictions"
import { Results } from "@/components/prode/screens/results"
import { Ranking } from "@/components/prode/screens/ranking"
import { Profile } from "@/components/prode/screens/profile"
import { Season } from "@/components/prode/screens/season"
import { Leagues } from "@/components/prode/screens/leagues"

export default function Page() {
  const [screen, setScreen] = useState<Screen>("inicio")

  function navigate(s: Screen) {
    setScreen(s)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }

  return (
    <NavContext.Provider value={{ screen, navigate }}>
      <div className="mx-auto min-h-screen max-w-md bg-background pb-20">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => navigate("inicio")}
            className="flex items-center gap-2"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground">
              F1
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">
              PRODE F1 <span className="text-arg">🇦🇷</span>
            </span>
          </button>
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground"
            aria-label="Notificaciones"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
          </button>
        </header>

        <main key={screen} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          {screen === "inicio" && <Dashboard />}
          {screen === "predicciones" && <Predictions />}
          {screen === "resultados" && <Results />}
          {screen === "ranking" && <Ranking />}
          {screen === "perfil" && <Profile />}
          {screen === "temporada" && <Season />}
          {screen === "ligas" && <Leagues />}
        </main>

        <BottomNav />
      </div>
    </NavContext.Provider>
  )
}
