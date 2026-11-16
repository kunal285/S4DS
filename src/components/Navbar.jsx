"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, Sparkles, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "TECHNEX '26", href: "/technex-2k26", badge: "Live" },
    { name: "Team", href: "/team" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Chapter Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md shadow-brand-orange/20 group-hover:scale-105 transition-transform duration-200 bg-surface-light p-0.5">
              <Image
                src="/images/logo.png"
                alt="S4DS MITAOE Official Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                S4DS <span className="text-brand-orange font-bold text-sm tracking-normal">MITAOE</span>
              </span>
              <span className="text-[10px] text-text-muted tracking-widest uppercase font-semibold">
                Society for Data Science
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                    active
                      ? "text-brand-yellow bg-brand-orange/15 shadow-sm border border-brand-orange/25"
                      : "text-text-secondary hover:text-white hover:bg-surface-light"
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-brand-red/20 text-brand-orange border border-brand-orange/30 animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">

            <Link
              href="/membership"
              className="px-5 py-2.5 text-xs font-extrabold rounded-xl brand-btn flex items-center gap-1.5 shadow-md shadow-brand-red/25"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Join S4DS
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-surface-light focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6 text-brand-orange" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-surface border-b border-border px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                    active
                      ? "text-brand-yellow bg-brand-orange/15 border border-brand-orange/20"
                      : "text-text-secondary hover:text-white hover:bg-surface-light"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.name}
                    {link.badge && (
                      <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-brand-red/20 text-brand-orange">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            <Link
              href="/membership"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-center rounded-xl brand-btn font-extrabold text-sm shadow-md"
            >
              Join S4DS Membership
            </Link>
            <Link
              href="/technex-2k26"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-center rounded-xl bg-surface-light text-text-secondary hover:text-white font-semibold text-sm border border-border"
            >
              Register for TECHNEX 2K26
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
