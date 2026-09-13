import {
  getSubscriptions,
  getSubscriptionMetrics,
} from "@/features/admin/subscriptionActions";
import { SubscriptionClient } from "./SubscriptionClient";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const [data, metrics] = await Promise.all([
    getSubscriptions({ page: 1, pageSize: 25 }),
    getSubscriptionMetrics(),
  ]);

  return <SubscriptionClient initialData={data} metrics={metrics} />;
}
