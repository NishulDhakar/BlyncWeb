import React from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Brain, Mail, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { footerNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import HlsVideo from "@/components/common/HlsVideo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Instagram", href: siteConfig.links.instagram, icon: Instagram },
    { name: "Twitter", href: siteConfig.links.twitter, icon: Twitter },
    { name: "GitHub", href: siteConfig.links.github, icon: Github },
    { name: "LinkedIn", href: "https://linkedin.com/in/nishuldhakar", icon: Linkedin },
  ];

  return (
    <footer className="relative overflow-hidden mt-20">
      {/* Video background */}
      {/* <HlsVideo
        src="https://stream.mux.com/01yW6GoUz01OTXk5w1Rt1MHkJWlCGIwj46SUONJZ4DJUE.m3u8"
        className="absolute inset-0 w-full h-full object-cover z-0"
      /> */}

      {/* Top fade from page background */}
      <div
        className="absolute inset-x-0 top-0 h-[200px] z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, black, transparent)" }}
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/75 z-[1]" aria-hidden="true" />

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-10 md:pt-20 md:pb-12">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Blync</span>
            </Link>
            <p className="text-sm text-white/50 mb-6 max-w-sm leading-relaxed">
              Master cognitive ability tests with our scientifically designed practice platform. Prepare for Capgemini, Cognizant, and other placement assessments.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/8 border border-white/10 hover:bg-white/15 hover:border-white/20 text-white/50 hover:text-white transition-all"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Games */}
          <div>
            <h3 className="font-semibold mb-4 text-sm text-white/80">Games</h3>
            <ul className="space-y-3">
              {footerNavItems.games.slice(0, 5).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/45 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-sm text-white/80">Company</h3>
            <ul className="space-y-3">
              {footerNavItems.resources.slice(3).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/45 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-sm text-white/80">Resources</h3>
            <ul className="space-y-3">
              {footerNavItems.resources.slice(0, 3).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/45 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm text-white/80">Legal</h3>
            <ul className="space-y-3">
              {footerNavItems.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/45 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-8 bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <p className="text-sm text-white/40">
            © {currentYear} Blync. All rights reserved.
          </p>

          <div className="group flex items-center gap-2">
            <Image
              className="size-8 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors"
              src="/og-logo.png"
              width={32}
              height={32}
              alt="Blync logo"
            />
            <p className="text-sm text-white/40 transition-all duration-300 group-hover:text-white/70">
              <Link target="_blank" href="https://www.nishul.dev">
                Built with ❤️{" "}
                <span className="group-hover:underline transition-all duration-300">by Nishul</span>
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/40">
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
            <span className="text-white/20">•</span>
            <a
              href="mailto:nishuldhakar123@gmail.com"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}