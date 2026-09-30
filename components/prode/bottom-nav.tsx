"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Flag, BarChart3, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/predictions", label: "Predicción", icon: Flag },
  { href: "/results", label: "Resultados", icon: BarChart3 },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/profile", label: "Perfil", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl"
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
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
            </Link>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}