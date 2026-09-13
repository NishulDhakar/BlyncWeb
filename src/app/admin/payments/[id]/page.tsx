import { getPaymentDetails } from "@/features/admin/paymentActions";
import { PaymentDetailClient } from "./PaymentDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = await getPaymentDetails(id);

  if (!payment) {
    notFound();
  }

  return <PaymentDetailClient payment={payment} />;
}
