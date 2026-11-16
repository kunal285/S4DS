import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Globe, Linkedin, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-brand-border mt-20 text-brand-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Chapter Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-brand-red/20 border border-brand-border bg-background-elevated p-1">
                <Image
                  src="/images/logo.png"
                  alt="S4DS MITAOE Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-brand-white tracking-tight block">
                  S4DS MITAOE
                </span>
                <span className="text-[11px] font-semibold text-brand-orange uppercase tracking-wider block">
                  Society for Data Science
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted">
              Society for Data Science Student Chapter at MIT Academy of Engineering, Alandi, Pune.
              Nurturing innovation, machine learning mastery, and data science leadership.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-background-card border border-brand-border flex items-center justify-center text-brand-secondary hover:text-brand-yellow hover:border-brand-border-hover transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-background-card border border-brand-border flex items-center justify-center text-brand-secondary hover:text-brand-yellow hover:border-brand-border-hover transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://mitaoe.ac.in"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-background-card border border-brand-border flex items-center justify-center text-brand-secondary hover:text-brand-yellow hover:border-brand-border-hover transition-colors"
                aria-label="MITAOE Official Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-white">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors">
                  About the Chapter
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-brand-orange transition-colors">
                  Workshops & Events
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-brand-orange transition-colors">
                  Leadership & Faculty
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-brand-orange transition-colors">
                  Event Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Initiatives & Programs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-white">
              Initiatives
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/technex-2k26" className="text-brand-yellow hover:text-brand-orange font-semibold transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                  TECHNEX 2K26 Expo
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-brand-orange transition-colors">
                  Join S4DS Membership
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange transition-colors">
                  Sponsorship & Collaboration
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
                  MIT Academy of Engineering, Dehu Phata, Alandi (D), Pune, Maharashtra 412105
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <span>{process.env.NEXT_PUBLIC_CHAPTER_EMAIL || "s4ds.datascience@mitaoe.ac.in"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <p>© {new Date().getFullYear()} S4DS MITAOE Student Chapter. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-brand-red fill-brand-red" /> by MITAOE Data Science Chapter
          </p>
        </div>
      </div>
    </footer>
  );
}
