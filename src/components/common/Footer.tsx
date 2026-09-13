import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { footerNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Instagram", href: siteConfig.links.instagram, icon: Instagram },
    { name: "Twitter", href: siteConfig.links.twitter, icon: Twitter },
    { name: "GitHub", href: siteConfig.links.github, icon: Github },
    { name: "LinkedIn", href: "https://linkedin.com/in/nishuldhakar", icon: Linkedin },
  ];

  const columns: { title: string; links: { label: string; href: string }[] }[] = [
    { title: "Games", links: footerNavItems.games.slice(0, 5) },
    { title: "Practice Sets", links: footerNavItems.hubs },
    { title: "Company", links: footerNavItems.resources.slice(3) },
    { title: "Resources", links: footerNavItems.resources.slice(0, 3) },
    { title: "Legal", links: footerNavItems.legal },
  ];

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/og-logo.png"
                width={32}
                height={32}
                alt="Blync logo"
                className="size-8 rounded-lg border border-border"
              />
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                Blync
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Practice the exact game-based cognitive rounds used by Capgemini,
              Cognizant, and other campus recruiters — calm enough to use every day.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={name}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label + link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {currentYear} Blync. All rights reserved.</p>

          <Link
            href="https://www.nishul.dev"
            target="_blank"
            className="transition-colors hover:text-foreground"
          >
            Built with <span aria-hidden="true">❤️</span> by Nishul
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="transition-colors hover:text-foreground">
              Sitemap
            </Link>
            <span aria-hidden="true" className="text-border">
              •
            </span>
            <a
              href="mailto:nishuldhakar123@gmail.com"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Mail className="size-3.5" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
