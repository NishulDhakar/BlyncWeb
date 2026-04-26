import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import HlsVideo from "@/components/common/HlsVideo"

export default async function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const session = await auth.api.getSession({
      headers: await headers()
   })

   if (session) {
      return redirect("/")
   }
   return (
      <main className="relative h-screen">
         <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disableRemotePlayback
            webkit-playsinline="true"
            x5-playsinline="true"
            poster="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
         >
            <source
               src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4"
               type="video/mp4"
            />
         </video>
      
         <div className="relative h-full flex flex-col items-center justify-center">
            {children}
         </div>
      </main>
   );
}