import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Globe, Linkedin, Github, Heart } from "lucide-react";
import { getSettings } from "@/lib/db";

export default async function Footer() {
  const settings = await getSettings();

  const social = settings.socialLinks || {};
  const currentYear = new Date().getFullYear();
  const copyright = (settings.copyrightText || "© {year} S4DS MITAOE Student Chapter. All rights reserved.").replace("{year}", currentYear);

  return (
    <footer className="bg-background-secondary border-t border-brand-border mt-20 text-brand-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Chapter Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-brand-red/20 border border-brand-border bg-background-elevated p-1 flex items-center justify-center">
                <Image
                  src={settings.logoUrl || "/images/logo.png"}
                  alt={`${settings.websiteName || "S4DS MITAOE"} Logo`}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-brand-white tracking-tight block">
                  {settings.websiteName || "S4DS MITAOE"}
                </span>
                <span className="text-[11px] font-semibold text-brand-orange uppercase tracking-wider block">
                  {settings.websiteTagline || "Society for Data Science"}
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted">
              {settings.footerText || settings.websiteDescription}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-background-card border border-brand-border flex items-center justify-center text-brand-secondary hover:text-brand-yellow hover:border-brand-border-hover transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-background-card border border-brand-border flex items-center justify-center text-brand-secondary hover:text-brand-yellow hover:border-brand-border-hover transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {social.website && (
                <a
                  href={social.website}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-background-card border border-brand-border flex items-center justify-center text-brand-secondary hover:text-brand-yellow hover:border-brand-border-hover transition-colors"
                  aria-label="Official Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-white">
              Public Sections
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/technex-2k26" className="text-brand-yellow hover:text-brand-orange font-semibold transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                  TECHNEX 2K26
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors">
                  About Chapter
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-brand-orange transition-colors">
                  Workshops &amp; Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Initiatives & Team */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-white">
              Initiatives &amp; Team
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/team" className="hover:text-brand-orange transition-colors">
                  Executive Team
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-brand-orange transition-colors">
                  Event Gallery
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-brand-orange transition-colors">
                  Student Projects
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-brand-orange transition-colors">
                  Membership Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Coordinates */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-white">
              Campus Location
            </h3>
            <div className="space-y-2.5 text-sm text-brand-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span>
                  {settings.contactAddress}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <p>{copyright}</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-brand-red fill-brand-red" /> by MITAOE Data Science Chapter
          </p>
        </div>
      </div>
    </footer>
  );
}
