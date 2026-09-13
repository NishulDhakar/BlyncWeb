import { getMockTestsList } from "@/features/admin/mockTestActions";
import { getCompanies } from "@/features/admin/companyActions";
import { getGamesList } from "@/features/admin/gameActions";
import { MockTestClient } from "./MockTestClient";

export const dynamic = "force-dynamic";

export default async function AdminMockTestsPage() {
  const [tests, companies, games] = await Promise.all([
    getMockTestsList(),
    getCompanies(),
    getGamesList(),
  ]);

  return (
    <MockTestClient
      mockTests={tests}
      companies={companies.map((c) => ({ slug: c.slug, name: c.name }))}
      games={games.map((g) => ({ slug: g.slug, name: g.name }))}
    />
  );
}
