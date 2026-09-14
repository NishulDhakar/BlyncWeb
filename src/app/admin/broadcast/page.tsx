import { getUserCount, getBroadcastHistory } from "@/features/admin/actions";
import { BroadcastClient, type BroadcastItem } from "./BroadcastClient";

export const dynamic = "force-dynamic";

export default async function AdminBroadcastPage() {
  const [countRes, historyRes] = await Promise.all([
    getUserCount(),
    getBroadcastHistory(),
  ]);

  const userCount = countRes.success && typeof countRes.count === "number" ? countRes.count : 0;
  const history = historyRes.success && historyRes.data ? (historyRes.data as BroadcastItem[]) : [];

  return <BroadcastClient initialCount={userCount} initialHistory={history} />;
}
