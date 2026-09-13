import { getPayments } from "@/features/admin/paymentActions";
import { PaymentTableClient } from "./PaymentTableClient";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const data = await getPayments({ page: 1, pageSize: 25 });
  return <PaymentTableClient initialData={data} />;
}
