import { getCompanies } from "@/features/admin/companyActions";
import { CompanyClient } from "./CompanyClient";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  const companies = await getCompanies();
  return <CompanyClient companies={companies} />;
}
