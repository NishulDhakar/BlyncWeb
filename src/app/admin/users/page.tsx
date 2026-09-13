import { getUsers } from "@/features/admin/userActions";
import { UserTableClient } from "./UserTableClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const data = await getUsers({ page: 1, pageSize: 25 });
  return <UserTableClient initialData={data} />;
}
