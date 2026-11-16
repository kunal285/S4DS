"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Flame, Sparkles, ChevronRight, Lock } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Navigation Items with explicit status
  const navItems = [
    { name: "Home", href: "/", isLive: true },
    { name: "About Us", href: "/about", isLive: false },
    { name: "Events", href: "/events", isLive: false },
    { name: "TECHNEX 2K26", href: "/technex-2k26", isLive: true, badge: "Live" },
    { name: "Projects", href: "/projects", isLive: false },
    { name: "Our Team", href: "/team", isLive: false },
    { name: "Gallery", href: "/gallery", isLive: false },
    { name: "Contact", href: "/contact", isLive: true },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Chapter Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md shadow-brand-red/20 group-hover:scale-105 transition-transform duration-200 bg-background-elevated border border-brand-border p-1">
              <Image
                src="/images/logo.png"
                alt="S4DS MITAOE Official Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-brand-white flex items-center gap-1.5">
                S4DS <span className="text-brand-orange font-bold text-sm tracking-normal">MITAOE</span>
              </span>
              <span className="text-[10px] text-brand-muted tracking-widest uppercase font-semibold">
                Society for Data Science
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = item.isLive && isActive(item.href);

              if (item.isLive) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                      active
                        ? "text-brand-yellow bg-brand-orange/20 border border-brand-orange/40 shadow-sm"
                        : "text-brand-secondary hover:text-white hover:bg-background-elevated"
                    }`}
                  >
                    {item.name}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              }

              // Non-live items: Show as Coming Soon, disable direct navigation
              return (
                <div
                  key={item.name}
                  className="relative px-3 py-2 text-xs font-semibold rounded-lg text-brand-muted/70 flex items-center gap-1.5 cursor-not-allowed select-none group"
                  title={`${item.name} is currently under development`}
                >
                  <span>{item.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase bg-background-elevated text-brand-muted border border-brand-border/60">
                    Soon
                  </span>
                </div>
              );
            })}
          </nav>

          {/* Right Live CTA: TECHNEX 2K26 */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/technex-2k26"
              className="px-5 py-2.5 text-xs font-extrabold rounded-xl brand-btn flex items-center gap-1.5 shadow-md shadow-brand-red/30 transition-transform hover:scale-105"
            >
              <Flame className="w-3.5 h-3.5 text-brand-yellow" />
              TECHNEX 2K26
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-brand-secondary hover:text-white hover:bg-background-elevated focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6 text-brand-orange" /> : <Menu className="w-6 h-6 text-brand-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-background-secondary border-b border-brand-border px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const active = item.isLive && isActive(item.href);

              if (item.isLive) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                      active
                        ? "text-brand-yellow bg-brand-orange/20 border border-brand-orange/40"
                        : "text-brand-secondary hover:text-white hover:bg-background-elevated"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.name}
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="w-4 h-4 text-brand-muted" />
                  </Link>
                );
              }

              return (
                <div
                  key={item.name}
                  className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between text-brand-muted/70 bg-background-card/40 border border-brand-border/40 cursor-not-allowed select-none"
                >
                  <span className="flex items-center gap-2">
                    {item.name}
                    <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded bg-background-elevated text-brand-muted border border-brand-border">
                      Coming Soon
                    </span>
                  </span>
                  <Lock className="w-3.5 h-3.5 text-brand-muted/50" />
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-brand-border flex flex-col gap-2.5">
            <Link
              href="/technex-2k26"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-center rounded-xl brand-btn font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-brand-yellow" />
              Register for TECHNEX 2K26 (Live)
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-center rounded-xl bg-background-elevated text-brand-secondary hover:text-white font-semibold text-sm border border-brand-border"
            >
              Contact Chapter Secretariat
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
