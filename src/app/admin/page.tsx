import { getOverviewData } from "@/features/admin/overviewActions";
import { OverviewClient } from "./OverviewClient";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getOverviewData();
  return <OverviewClient initialData={data} />;
}
