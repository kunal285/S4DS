"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Code2,
  Sparkles,
  Search,
  Github,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All");

  const domains = [
    "All",
    "Artificial Intelligence & ML",
    "Data Science & Predictive Analytics",
    "Web3 & Decentralized Apps",
    "IoT, Robotics & Embedded Systems",
    "Cloud Architecture & DevOps",
  ];

  useEffect(() => {
    fetchProjects();
  }, [domain]);

  const filtered = projects.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      (Array.isArray(p.authors) && p.authors.some((a) => a.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-border text-xs font-bold text-brand-orange uppercase tracking-wider">
          <Code2 className="w-4 h-4 text-brand-yellow" /> Student Research &amp; Prototypes
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-brand-white tracking-tight">
          Engineering <span className="brand-text-gradient">Innovations</span>
        </h1>
        <p className="text-base sm:text-lg text-brand-secondary">
          Explore breakthrough student-built applications, deep learning pipelines, and research prototypes developed by the Society for Data Science chapter at MITAOE.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background-card border border-brand-border text-xs text-brand-white focus:outline-none focus:border-brand-orange"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                domain === d
                  ? "bg-brand-orange text-white shadow-md shadow-brand-red/30"
                  : "bg-background-card text-brand-muted hover:text-white border border-brand-border"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No Projects Found"
          message={search ? "No projects matched your search criteria." : "No projects published in this domain yet."}
          actionLabel={search ? "Reset Search" : undefined}
          onAction={search ? () => setSearch("") : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="rounded-3xl bg-background-card border border-brand-border overflow-hidden hover:border-brand-orange/40 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="relative h-48 w-full bg-background-elevated">
                  {proj.imageUrl ? (
                    <Image
                      src={proj.imageUrl}
                      alt={proj.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-brand-muted">
                      No Image Available
                    </div>
                  )}
                  {proj.isFeatured && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-brand-orange text-white shadow-md">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block">
                    {proj.domain}
                  </span>
                  <h3 className="font-extrabold text-base text-brand-white leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-brand-muted line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>

                  {Array.isArray(proj.techStack) && proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[9px] font-semibold bg-background-elevated border border-brand-border text-brand-secondary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {Array.isArray(proj.authors) && proj.authors.length > 0 && (
                    <div className="text-[11px] text-brand-secondary pt-2 border-t border-brand-border">
                      <strong className="text-brand-muted">Student Team: </strong>
                      {proj.authors.join(", ")}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-background-elevated/40 border-t border-brand-border flex items-center justify-between">
                <span className="text-[11px] text-brand-muted">S4DS Incubated</span>
                <div className="flex items-center gap-2">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-background-card hover:bg-background-elevated text-brand-muted hover:text-brand-white border border-brand-border transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-background-card hover:bg-background-elevated text-brand-muted hover:text-brand-white border border-brand-border transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
