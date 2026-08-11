"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { BottomNav } from "@/components/prode/bottom-nav"
import { NavContext, type Screen } from "@/components/prode/nav-context"
import { Dashboard } from "@/components/prode/screens/dashboard"
import { Predicciones } from "@/components/prode/screens/predicciones"
import { Resultados } from "@/components/prode/screens/resultados"
import { Ranking } from "@/components/prode/screens/ranking"
import { Perfil } from "@/components/prode/screens/perfil"
import { Temporada } from "@/components/prode/screens/temporada"
import { Ligas } from "@/components/prode/screens/ligas"

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
          {screen === "predicciones" && <Predicciones />}
          {screen === "resultados" && <Resultados />}
          {screen === "ranking" && <Ranking />}
          {screen === "perfil" && <Perfil />}
          {screen === "temporada" && <Temporada />}
          {screen === "ligas" && <Ligas />}
        </main>

        <BottomNav />
      </div>
    </NavContext.Provider>
  )
}
