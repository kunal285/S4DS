"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Flame, Sparkles, ChevronRight, Lock } from "lucide-react";

let clientSettingsCache = null;
let clientSettingsTime = 0;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (clientSettingsCache && Date.now() - clientSettingsTime < 60000) {
      setSettings(clientSettingsCache);
      return;
    }
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          clientSettingsCache = json.data;
          clientSettingsTime = Date.now();
          setSettings(json.data);
        }
      })
      .catch((err) => console.warn("Notice: Fetching navbar settings:", err));
  }, []);

  // Navigation Items
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "TECHNEX 2K26", href: "/technex-2k26", badge: "Live" },
    { name: "Projects", href: "/projects" },
    { name: "Our Team", href: "/team" },
    { name: "Gallery", href: "/gallery" },
    { name: "Membership", href: "/membership" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-brand-border/60" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        <div className="flex items-center justify-between h-20" suppressHydrationWarning>
          {/* Logo / Chapter Identity */}
          <Link href="/" className="flex items-center gap-3.5 group" suppressHydrationWarning>
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md shadow-brand-red/20 group-hover:scale-105 transition-transform duration-200 bg-background-elevated border border-brand-border p-1 flex items-center justify-center shrink-0" suppressHydrationWarning>
              <Image
                src={settings?.logoUrl || "/images/logo.png"}
                alt={`${settings?.websiteName || "S4DS MITAOE"} Official Logo`}
                width={36}
                height={36}
                className="object-contain"
                priority
                suppressHydrationWarning
              />
            </div>
            <div className="flex flex-col" suppressHydrationWarning>
              <span className="font-black text-lg tracking-tight text-brand-white flex items-center gap-1.5" suppressHydrationWarning>
                {settings?.websiteName ? settings.websiteName.split(" ")[0] : "S4DS"}{" "}
                <span className="text-brand-orange font-bold text-sm tracking-normal" suppressHydrationWarning>
                  {settings?.websiteName ? settings.websiteName.split(" ").slice(1).join(" ") : "MITAOE"}
                </span>
              </span>
              <span className="text-[10px] text-brand-muted tracking-widest uppercase font-semibold" suppressHydrationWarning>
                {settings?.websiteTagline || "Society for Data Science"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" suppressHydrationWarning>
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  suppressHydrationWarning
                  className={`relative px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                    active
                      ? "text-brand-yellow bg-brand-orange/20 border border-brand-orange/40 shadow-sm"
                      : "text-brand-secondary hover:text-white hover:bg-background-elevated"
                  }`}
                >
                  {item.name}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" suppressHydrationWarning>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/technex-2k26"
              className="px-4 py-2 rounded-xl brand-btn text-xs font-extrabold flex items-center gap-2 shadow-md shadow-brand-red/20 hover:scale-105 active:scale-95 transition-transform"
            >
              <Flame className="w-3.5 h-3.5 text-brand-yellow" />
              <span>TECHNEX 2K26</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-background-elevated border border-brand-border text-brand-secondary hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-background-secondary/95 backdrop-blur-2xl border-b border-brand-border px-4 pt-3 pb-6 space-y-4 shadow-2xl" suppressHydrationWarning>
          <div className="flex flex-col gap-1.5" suppressHydrationWarning>
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  suppressHydrationWarning
                  className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                    active
                      ? "text-brand-yellow bg-brand-orange/20 border border-brand-orange/40"
                      : "text-brand-white hover:bg-background-elevated"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge ? (
                    <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" suppressHydrationWarning>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-brand-muted" />
                  )}
                </Link>
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
          </div>
        </div>
      )}
    </header>
  );
}
