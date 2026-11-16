"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Code2,
  Image as ImageIcon,
  ClipboardList,
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
  FolderOpen,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, skip protection check
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    setChecking(true);
    try {
      const token = localStorage.getItem("s4ds_admin_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch("/api/auth/me", { headers });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.push("/admin/login");
      }
    } catch {
      setAuthorized(false);
      router.push("/admin/login");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("s4ds_admin_token");
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-brand-muted">Verifying chapter administrative credentials...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Media Manager", href: "/admin/media", icon: FolderOpen },
    { name: "Events Manager", href: "/admin/events", icon: Calendar },
    { name: "Team Manager", href: "/admin/team", icon: Users },
    { name: "Projects Manager", href: "/admin/projects", icon: Code2 },
    { name: "Gallery Manager", href: "/admin/gallery", icon: ImageIcon },
    { name: "Registrations", href: "/admin/registrations", icon: ClipboardList },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Sub-Navbar for Mobile */}
      <div className="lg:hidden flex items-center justify-between p-4 rounded-2xl bg-background-card mb-6 border border-brand-border">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-orange" />
          <span className="font-bold text-brand-white text-sm">S4DS Admin Control</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-background-elevated text-brand-secondary border border-brand-border"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside
          className={`lg:col-span-3 space-y-6 ${
            mobileMenuOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="p-6 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-brand-border">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-brand-red/20 shrink-0 border border-brand-border bg-background-elevated p-0.5">
                <Image src="/images/logo.png" alt="S4DS Logo" fill className="object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-brand-white text-sm">S4DS Admin</h3>
                <span className="text-[11px] text-brand-yellow font-semibold">MITAOE Chapter</span>
              </div>
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? "bg-brand-orange text-white shadow-md shadow-brand-red/20 font-bold"
                        : "text-brand-secondary hover:text-brand-white hover:bg-background-elevated"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-brand-border space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-brand-muted hover:text-brand-white hover:bg-background-elevated transition-colors"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-[#2d1210]/60 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
