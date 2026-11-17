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
  const [settings, setSettings] = useState(clientSettingsCache);
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

  const pageAvailability = settings?.pageAvailability || {
    home: true,
    technex: true,
    contact: true,
    about: false,
    events: false,
    team: false,
    gallery: false,
    projects: false,
    membership: false,
  };

  // Dynamic Navigation Items with live status from RushDB
  const navItems = [
    { name: "Home", href: "/", isLive: pageAvailability.home !== false },
    { name: "About Us", href: "/about", isLive: Boolean(pageAvailability.about) },
    { name: "Events", href: "/events", isLive: Boolean(pageAvailability.events) },
    { name: "TECHNEX 2K26", href: "/technex-2k26", isLive: pageAvailability.technex !== false, badge: "Live" },
    { name: "Projects", href: "/projects", isLive: Boolean(pageAvailability.projects) },
    { name: "Our Team", href: "/team", isLive: Boolean(pageAvailability.team) },
    { name: "Gallery", href: "/gallery", isLive: Boolean(pageAvailability.gallery) },
    { name: "Contact", href: "/contact", isLive: pageAvailability.contact !== false },
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
                src={settings?.logoUrl || "/images/logo.png"}
                alt={`${settings?.websiteName || "S4DS MITAOE"} Official Logo`}
                fill
                sizes="44px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-brand-white flex items-center gap-1.5">
                {settings?.websiteName ? settings.websiteName.split(" ")[0] : "S4DS"}{" "}
                <span className="text-brand-orange font-bold text-sm tracking-normal">
                  {settings?.websiteName ? settings.websiteName.split(" ").slice(1).join(" ") : "MITAOE"}
                </span>
              </span>
              <span className="text-[10px] text-brand-muted tracking-widest uppercase font-semibold">
                {settings?.websiteTagline || "Society for Data Science"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);

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

              // Under development items: Clickable link opening development preview
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                    active
                      ? "text-brand-yellow bg-brand-orange/20 border border-brand-orange/40"
                      : "text-brand-secondary/80 hover:text-white hover:bg-background-elevated"
                  }`}
                  title={`${item.name} is currently under development (Preview)`}
                >
                  <span>{item.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                    Soon
                  </span>
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
        <div className="lg:hidden bg-background-secondary/95 backdrop-blur-2xl border-b border-brand-border px-4 pt-3 pb-6 space-y-4 shadow-2xl">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = isActive(item.href);

              if (item.isLive) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                      active
                        ? "text-brand-yellow bg-brand-orange/20 border border-brand-orange/40"
                        : "text-brand-white hover:bg-background-elevated"
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.badge ? (
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-brand-muted" />
                    )}
                  </Link>
                );
              }

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
                    <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                      Soon
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-brand-muted" />
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
