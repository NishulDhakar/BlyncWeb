import { getAuditLogsList } from "@/features/admin/settingsActions";
import { AuditLogsClient } from "./AuditLogsClient";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const logs = await getAuditLogsList(1, 50);
  return <AuditLogsClient logs={logs} />;
}
