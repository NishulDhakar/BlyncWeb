import { getDeepAnalytics } from "@/features/admin/analyticsActions";
import { AnalyticsClient } from "./AnalyticsClient";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const data = await getDeepAnalytics();
  return <AnalyticsClient data={data} />;
}
