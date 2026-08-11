"use client"

import { Home, Flag, BarChart3, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Screen, useNav } from "./nav-context"

const items: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "predicciones", label: "Predicción", icon: Flag },
  { id: "resultados", label: "Resultados", icon: BarChart3 },
  { id: "ranking", label: "Ranking", icon: Trophy },
  { id: "perfil", label: "Perfil", icon: User },
]

export function BottomNav() {
  const { screen, navigate } = useNav()
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl"
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const active = screen === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              aria-current={active ? "page" : undefined}
              className="group relative flex flex-col items-center gap-1 py-2.5 transition-colors"
            >
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />
              )}
              <Icon
                className={cn(
                  "size-5 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}