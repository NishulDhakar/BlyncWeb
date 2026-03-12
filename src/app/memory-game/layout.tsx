import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/common/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  const user = session?.user;
  return (
    <UserProvider user={user ?? null}>
              <Header />
      <main className="flex-1 p-6">{children}</main>

    </UserProvider>
  );
}
