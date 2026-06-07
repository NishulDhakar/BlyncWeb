import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import LenisProvider from "@/components/common/LenisProvider";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  other: {
    "google-adsense-account": siteConfig.adsenseId,
  },

  title: {
    default:
      "Capgemini & Cognizant Game-Based Aptitude Practice | Blync Placement Games",
    template: "%s | Blync Cognitive Games",
  },

  description: siteConfig.description,
  keywords: [...siteConfig.keywords],

  alternates: {
    canonical: siteConfig.url,
  },

  openGraph: {
    title: "Capgemini & Cognizant Game-Based Aptitude Practice | Blync",
    description:
      "Free game-based aptitude practice for Capgemini & Cognizant. Play Switch, Digit, Grid, Motion, Spacio, Inductive & Deductive challenges with full solutions.",
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    locale: siteConfig.locale,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Capgemini & Cognizant Placement Games | Blync",
    description:
      "Crack Capgemini & Cognizant game-based rounds using Blync cognitive games. Real exam-style practice.",
    creator: siteConfig.creator,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
};

// ✅ STRUCTURED DATA (JSON-LD)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  alternateName: "Capgemini & Cognizant Placement Games",
  url: siteConfig.url,
  description:
    "Free platform for practicing game-based cognitive aptitude tests used in Capgemini, Cognizant & other campus placements.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.shortName,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.ogImage}`,
  sameAs: [siteConfig.links.twitter, siteConfig.links.github],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Blync Cognitive Placement Games",
  url: siteConfig.url,
  applicationCategory: "EducationalApplication",
  operatingSystem: "All",
  description:
    "Interactive game-based aptitude practice platform for placement preparation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* ✅ Google AdSense — afterInteractive keeps it off the critical path */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* ✅ Google Analytics config */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${siteConfig.analyticsId}', {
        page_path: window.location.pathname,
      });`}
        </Script>

        {/* ✅ Umami Analytics */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={siteConfig.umamiId}
          strategy="afterInteractive"
        />

        {/* ✅ STRUCTURED DATA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />

        {/* ✅ PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#131221" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Blync" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* ✅ PERFORMANCE — preconnect for video CDN, analytics, and ads */}
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://d8j0ntlcm91z4.cloudfront.net" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://cloud.umami.is" />

        {/* ✅ FONT PRELOADS — avoids Flash of Invisible Text (FOIT) */}
        <link rel="preload" as="font" type="font/ttf" href="/fonts/Parkinsans-VariableFont_wght.ttf" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/ttf" href="/fonts/SpaceGrotesk-VariableFont_wght.ttf" crossOrigin="anonymous" />
      </head>
 
      <body className="relative">
        {/* Gradient blobs — Pre-blurred radial-gradient background to avoid GPU-heavy CSS filters */}
        <div 
          className="absolute top-0 left-0 w-full h-[1000px] opacity-40 mix-blend-multiply pointer-events-none overflow-hidden" 
          aria-hidden="true"
          style={{
            backgroundImage: "radial-gradient(circle 50vw at 15% 0%, rgba(255, 107, 107, 0.5) 0%, transparent 80%), radial-gradient(circle 50vw at 85% 0%, rgba(79, 70, 229, 0.5) 0%, transparent 80%)"
          }}
        />

        <LenisProvider>
          <main>{children}</main>
        </LenisProvider>

        {/* ✅ Service Worker registration for PWA */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
