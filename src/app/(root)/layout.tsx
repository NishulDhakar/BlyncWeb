
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserProvider } from "@/context/UserContext";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
   title: "Free Game-Based Aptitude Practice for Capgemini & Cognizant | Blync",
   description:
      "Practice free Capgemini game-based aptitude tests online. Play Switch, Grid, Digit, Motion, Inductive & Deductive challenges — the exact cognitive games used in Capgemini & Cognizant placement rounds. No signup needed.",
   keywords: [
      "capgemini gaming",
      "capgemini games",
      "capgemini game based aptitude",
      "game based aptitude test",
      "capgemini cognitive ability games",
      "game based aptitude test free practice",
      "aptitude games",
      "capgemini gaming round",
   ],
   alternates: {
      canonical: siteConfig.url,
   },
};


export default async function HomeLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const session = await auth.api.getSession({
      headers: await headers()
   });
   const user = session?.user ?? null;
   return (
      <UserProvider user={user}>
         <Header />
         <main className="">
            {children}
         </main>
         <Footer />
      </UserProvider>
   );
}
