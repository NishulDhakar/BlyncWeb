import { getGamesList } from "@/features/admin/gameActions";
import { GameClient } from "./GameClient";

export const dynamic = "force-dynamic";

export default async function AdminGamesPage() {
  const games = await getGamesList();
  return <GameClient games={games} />;
}
