import { Results } from "@/components/prode/screens/results"

// /results?user=<id> muestra la predicción de otro miembro de la liga activa
export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { user } = await searchParams
  return <Results viewedUserId={typeof user === "string" ? user : undefined} />
}
