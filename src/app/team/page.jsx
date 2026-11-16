"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { isRouteLive } from "@/config/site-mode";
import UnderDevelopment from "@/components/UnderDevelopment";
import { Linkedin, Github, Users, Mail, GraduationCap } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

export default function TeamPage() {
  if (!isRouteLive("/team")) {
    return <UnderDevelopment section="Core Team & Faculty" />;
  }

  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const categories = [
    "All",
    "Faculty",
    "Core Leadership",
    "Heads",
    "Coordinators",
  ];

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      if (data.success) {
        setTeam(data.data || []);
      } else {
        setError(data.error || "Failed to load team");
      }
    } catch (err) {
      setError("Network error loading team members.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTeam = team.filter((m) => {
    if (filterRole === "All") return true;
    const r = m.role?.toLowerCase() || "";
    if (filterRole === "Faculty") return r.includes("faculty") || r.includes("coordinator") && !r.includes("student");
    if (filterRole === "Core Leadership") return r.includes("president") || r.includes("secretary") || r.includes("treasurer");
    if (filterRole === "Heads") return r.includes("head") && !r.includes("co-head");
    if (filterRole === "Coordinators") return r.includes("co-head") || r.includes("coordinator");
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* ── Page Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-border text-xs font-bold text-brand-orange uppercase tracking-wider">
          <Users className="w-4 h-4 text-brand-yellow" /> Faculty Advisors & Student Board
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-brand-white tracking-tight">
          The Leadership Behind <span className="brand-text-gradient">S4DS MITAOE</span>
        </h1>
        <p className="text-base sm:text-lg text-brand-secondary">
          Meet our esteemed faculty advisors, executive council, and student heads committed
          to driving excellence across our chapter and the TECHNEX 2K26 National Expo.
        </p>
      </div>

      {/* ── Filter ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-3 rounded-2xl bg-background-card border border-brand-border max-w-2xl mx-auto shadow-md">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterRole(cat)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filterRole === cat
                ? "bg-brand-orange text-white shadow-md shadow-brand-red/20"
                : "bg-background-elevated text-brand-secondary hover:text-brand-white border border-brand-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Team Grid ── */}
      {loading ? (
        <LoadingSkeleton count={4} type="card" />
      ) : error ? (
        <div className="p-8 text-center text-rose-400 rounded-2xl bg-background-card border border-rose-500/30">
          {error}
        </div>
      ) : filteredTeam.length === 0 ? (
        <EmptyState
          title="No team members found"
          description="Try selecting a different role category."
          actionLabel="View All"
          onAction={() => setFilterRole("All")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTeam.map((m) => (
            <div
              key={m.id}
              className="rounded-3xl bg-background-card border border-brand-border p-6 flex flex-col items-center text-center hover:border-brand-border-hover transition-all group shadow-lg"
            >
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-brand-border group-hover:border-brand-orange transition-all mb-4 bg-background-elevated shadow-inner">
                <Image
                  src={m.photoUrl || m.avatarUrl || "/images/logo.png"}
                  alt={m.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-background-elevated text-brand-orange border border-brand-border mb-2 uppercase tracking-wider">
                {m.department || "Data Science"}
              </span>

              <h3 className="text-lg font-bold text-brand-white group-hover:text-brand-orange transition-colors">
                {m.name}
              </h3>
              <p className="text-xs font-bold text-brand-yellow mb-2">{m.role}</p>

              {m.bio && (
                <p className="text-xs text-brand-muted leading-relaxed mb-4 line-clamp-3">
                  {m.bio}
                </p>
              )}

              <div className="mt-auto flex items-center gap-3 pt-3 border-t border-brand-border w-full justify-center">
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="p-2 rounded-lg bg-background-elevated text-brand-secondary hover:text-brand-yellow hover:border-brand-orange border border-brand-border transition-colors"
                    title={`Email ${m.name}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {m.linkedinUrl && (
                  <a
                    href={m.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-background-elevated text-brand-secondary hover:text-brand-yellow hover:border-brand-orange border border-brand-border transition-colors"
                    aria-label={`${m.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {m.githubUrl && (
                  <a
                    href={m.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-background-elevated text-brand-secondary hover:text-brand-yellow hover:border-brand-orange border border-brand-border transition-colors"
                    aria-label={`${m.name}'s GitHub profile`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
