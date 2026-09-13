import { getContentItemsList } from "@/features/admin/contentActions";
import { getGamesList } from "@/features/admin/gameActions";
import { ContentClient } from "./ContentClient";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [items, games] = await Promise.all([
    getContentItemsList(),
    getGamesList(),
  ]);

  return (
    <ContentClient
      contentItems={items}
      games={games.map((g) => ({ slug: g.slug, name: g.name }))}
    />
  );
}
