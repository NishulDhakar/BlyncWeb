import { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/common/Header";

export const metadata: Metadata = {
  description:
    "Practice Capgemini game based aptitude test questions online for free. Prepare for the Capgemini cognitive ability games and gaming round with our mock tests for 2026 placements.",
  keywords: [
    "capgemini game based aptitude test",
    "capgemini game based aptitude questions pdf",
    "capgemini gaming round",
    "capgemini games round",
    "capgemini cognitive ability games",
    "game based aptitude test capgemini",
    "capgemini assessment test pattern",
    "capgemini aptitude questions",
    "capgemini previous year questions",
    "capgemini online test papers with answers",
    "capgemini technical assessment questions"
  ],
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <UserProvider user={null}>
      <Header />
      <main className="flex-1 p-6">{children}</main>
    </UserProvider>
  );
}
