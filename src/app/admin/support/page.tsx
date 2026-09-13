import { getSupportTickets } from "@/features/admin/supportActions";
import { SupportClient } from "./SupportClient";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const tickets = await getSupportTickets();
  return <SupportClient tickets={tickets} />;
}
