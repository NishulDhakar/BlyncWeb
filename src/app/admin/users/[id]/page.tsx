import { getUserDetails } from "@/features/admin/userActions";
import { UserDetailClient } from "./UserDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getUserDetails(id);

  if (!data) {
    notFound();
  }

  return <UserDetailClient data={data} />;
}
