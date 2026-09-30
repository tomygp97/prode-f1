import { Leagues } from "@/components/prode/screens/leagues"

// /leagues?code=ABC123 (link de invitación) abre Unirse con el código cargado
export default async function LeaguesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { code } = await searchParams
  return <Leagues initialCode={typeof code === "string" ? code : undefined} />
}
