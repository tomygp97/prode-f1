import { Predictions } from "@/components/prode/screens/predictions"

// /predictions?race=next abre la pestaña del próximo GP (desde la tarjeta chica del inicio)
export default async function PredictionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { race } = await searchParams
  return <Predictions initialTab={race === "next" ? "next" : undefined} />
}
