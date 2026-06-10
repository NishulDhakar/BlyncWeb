import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import HlsVideo from "@/components/common/HlsVideo"

export default async function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   try {
      const session = await auth.api.getSession({
         headers: await headers()
      })

      if (session) {
         return redirect("/")
      }
   } catch {
      // DB unreachable — skip redirect, show auth page as guest
   }
   return (
      <main className="relative h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none gpu-accelerated"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4"
      />
         <div className="relative h-full flex flex-col items-center justify-center">
            {children}
         </div>
      </main>
   );
}