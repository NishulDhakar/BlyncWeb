import { getCompanyDetails } from "@/features/admin/companyActions";
import { CompanyDetailClient } from "./CompanyDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminCompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCompanyDetails(id);

  if (!data) {
    notFound();
  }

  return <CompanyDetailClient data={data} />;
}
