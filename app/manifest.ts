import type { MetadataRoute } from "next"

// "Agregar a inicio" en el celular: nombre e ícono de la app (los íconos están en public/)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prode F1",
    short_name: "Prode F1",
    description: "Competí con tus amigos prediciendo cada Gran Premio de Fórmula 1.",
    start_url: "/",
    display: "standalone",
    background_color: "#151317",
    theme_color: "#0a0a0b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
