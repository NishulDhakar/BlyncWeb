import {
  getSystemSettings,
  getAdminUsersList,
} from "@/features/admin/settingsActions";
import { getCurrentAdmin } from "@/features/admin/auth";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, admins, currentAdmin] = await Promise.all([
    getSystemSettings(),
    getAdminUsersList(),
    getCurrentAdmin(),
  ]);

  return (
    <SettingsClient
      settings={settings}
      admins={admins}
      currentAdminEmail={currentAdmin?.email || ""}
    />
  );
}
