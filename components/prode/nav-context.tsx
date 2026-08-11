"use client"

import { createContext, useContext } from "react"

export type Screen =
  | "inicio"
  | "predicciones"
  | "resultados"
  | "ranking"
  | "perfil"
  | "temporada"
  | "ligas"

type NavContextType = {
  screen: Screen
  navigate: (s: Screen) => void
}

export const NavContext = createContext<NavContextType>({
  screen: "inicio",
  navigate: () => {},
})

export function useNav() {
  return useContext(NavContext)
}
