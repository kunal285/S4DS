"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Code2,
  Image as ImageIcon,
  Flame,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Settings,
  FolderOpen,
} from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("s4ds_admin_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch("/api/stats", { headers });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={4} type="card" />;
  }

  const statCards = [
    {
      title: "TECHNEX Teams",
      value: stats?.totalTechnexTeams || 0,
      sub: `${stats?.pendingTechnexTeams || 0} Pending Approval`,
      icon: Flame,
      color: "text-brand-orange",
      border: "hover:border-brand-orange",
      href: "/admin/registrations",
    },
    {
      title: "Chapter Memberships",
      value: stats?.totalMemberships || 0,
      sub: `${stats?.pendingMemberships || 0} Pending Verification`,
      icon: Users,
      color: "text-brand-yellow",
      border: "hover:border-brand-yellow",
      href: "/admin/registrations",
    },
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      sub: `${stats?.upcomingEvents || 0} Upcoming`,
      icon: Calendar,
      color: "text-brand-orange",
      border: "hover:border-brand-orange",
      href: "/admin/events",
    },
    {
      title: "Media Assets",
      value: stats?.totalMedia || 0,
      sub: "Supabase & RushDB",
      icon: FolderOpen,
      color: "text-brand-orange",
      border: "hover:border-brand-orange",
      href: "/admin/media",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-orange/15 border border-brand-border text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-yellow" /> Executive Overview
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-white">
          Chapter Operations Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Real-time summary of event logistics, student registrations, and website content.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className={`p-6 rounded-3xl bg-background-card border border-brand-border ${card.border} transition-all group block shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  {card.title}
                </span>
                <Icon className={`w-5 h-5 ${card.color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="text-3xl font-black text-brand-white mb-1">{card.value}</div>
              <div className="text-xs text-brand-yellow font-semibold">{card.sub}</div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Matrix */}
      <div className="p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
        <h3 className="text-lg font-bold text-brand-white">Administrative Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/media"
            className="p-4 rounded-2xl bg-background-elevated border border-brand-orange/40 hover:border-brand-orange transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-bold text-brand-white group-hover:text-brand-orange transition-colors block">
                Media Manager (Supabase Storage)
              </span>
              <span className="text-xs text-brand-muted">Manage posters, banners & payment QRs</span>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/events"
            className="p-4 rounded-2xl bg-background-elevated border border-brand-border hover:border-brand-orange transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-bold text-brand-white group-hover:text-brand-orange transition-colors block">
                Post New Event
              </span>
              <span className="text-xs text-brand-muted">Workshops, Hackathons, Expos</span>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/registrations"
            className="p-4 rounded-2xl bg-background-elevated border border-brand-border hover:border-brand-orange transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-bold text-brand-white group-hover:text-brand-orange transition-colors block">
                Review TECHNEX Teams
              </span>
              <span className="text-xs text-brand-muted">Verify UTR & assign status</span>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-yellow group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/team"
            className="p-4 rounded-2xl bg-background-elevated border border-brand-border hover:border-brand-orange transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-bold text-brand-white group-hover:text-brand-orange transition-colors block">
                Update Team Roster
              </span>
              <span className="text-xs text-brand-muted">Add or edit student leads</span>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 rounded-2xl bg-background-elevated border border-brand-border hover:border-brand-orange transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-bold text-brand-white group-hover:text-brand-orange transition-colors block">
                TECHNEX &amp; Site Settings
              </span>
              <span className="text-xs text-brand-muted">WhatsApp group &amp; chapter links</span>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-yellow group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/gallery"
            className="p-4 rounded-2xl bg-background-elevated border border-brand-border hover:border-brand-orange transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-bold text-brand-white group-hover:text-brand-orange transition-colors block">
                Upload Campus Photos
              </span>
              <span className="text-xs text-brand-muted">Expo and hackathon memories</span>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/technex-2k26"
            target="_blank"
            className="p-4 rounded-2xl bg-background-elevated border border-brand-border hover:border-brand-border-hover transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-sm font-bold text-brand-white group-hover:text-brand-yellow transition-colors block">
                Live TECHNEX Form
              </span>
              <span className="text-xs text-brand-muted">Test applicant submission</span>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-muted group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
