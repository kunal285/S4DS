"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import UnderDevelopment from "@/components/UnderDevelopment";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Sparkles,
  Award,
  X,
  ArrowRight,
} from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

export default function EventsPage() {
  const [isLive, setIsLive] = useState(false);
  const [checkingMode, setCheckingMode] = useState(true);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const categories = ["All", "Competition", "Workshop", "Hackathon", "Seminar"];
  const statuses = ["All", "Upcoming", "Completed"];

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          setIsLive(Boolean(json.data.pageAvailability?.events));
        }
      })
      .catch(() => setIsLive(false))
      .finally(() => setCheckingMode(false));
  }, []);

  useEffect(() => {
    if (isLive) {
      fetchEvents();
    }
  }, [category, status, isLive]);

  if (checkingMode) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-brand-muted">Loading events portal...</p>
      </div>
    );
  }

  if (!isLive) {
    return <UnderDevelopment section="Events & Workshops" />;
  }

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.append("category", category);
      if (status !== "All") params.append("status", status);

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data || []);
      } else {
        setError(data.error || "Failed to load events");
      }
    } catch (err) {
      setError("Network error while loading events.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(s) ||
      e.description.toLowerCase().includes(s) ||
      e.venue.toLowerCase().includes(s)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* ── Page Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-border text-xs font-bold text-brand-orange uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-brand-yellow" /> Academic Calendar & Activities
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-brand-white tracking-tight">
          Workshops, Hackathons & <span className="brand-text-gradient">Expos</span>
        </h1>
        <p className="text-base sm:text-lg text-brand-secondary">
          Discover hands-on masterclasses, technical hackathons, and our national flagship competition{" "}
          <strong className="text-brand-yellow font-bold">TECHNEX 2K26</strong>.
        </p>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-background-card border border-brand-border shadow-md">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                category === cat
                  ? "bg-brand-orange text-white shadow-md shadow-brand-red/20 font-bold"
                  : "bg-background-elevated text-brand-secondary hover:text-brand-white hover:bg-background-secondary border border-brand-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Search & Status */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-background-elevated px-3 py-1.5 rounded-lg border border-brand-border">
            <Filter className="w-3.5 h-3.5 text-brand-muted" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent text-xs text-brand-secondary focus:outline-none cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-background-card text-brand-secondary">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-background-elevated border border-brand-border text-brand-white placeholder-brand-muted focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>
      </div>

      {/* ── Content Grid ── */}
      {loading ? (
        <LoadingSkeleton count={3} type="card" />
      ) : error ? (
        <div className="p-8 text-center text-rose-400 rounded-2xl bg-background-card border border-rose-500/30">
          {error}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Try adjusting your category filters or search keywords."
          actionLabel="Clear Filters"
          onAction={() => {
            setCategory("All");
            setStatus("All");
            setSearch("");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="rounded-2xl bg-background-card border border-brand-border overflow-hidden hover:border-brand-border-hover transition-all flex flex-col group shadow-lg"
            >
              <div className="relative h-48 bg-background-elevated overflow-hidden">
                <Image
                  src={evt.posterUrl || "/images/technex-poster.png"}
                  alt={evt.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-background-secondary/95 text-brand-orange backdrop-blur-md border border-brand-border">
                    {evt.category}
                  </span>
                  {evt.isFeatured && (
                    <span className="px-2 py-1 text-xs font-bold rounded-lg bg-brand-yellow text-slate-950 backdrop-blur-md">
                      Featured
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      evt.status === "Upcoming"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-background-elevated text-brand-muted border border-brand-border"
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-brand-yellow font-semibold mb-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{evt.date}</span>
                    <span className="text-brand-muted">•</span>
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{evt.time}</span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-white mb-2 leading-snug group-hover:text-brand-orange transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-sm text-brand-muted line-clamp-3 leading-relaxed mb-4">
                    {evt.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-brand-border">
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="text-xs font-semibold text-brand-orange hover:text-brand-yellow transition-colors underline"
                    >
                      Quick Overview
                    </button>
                    {evt.category === "Competition" || evt.title.includes("TECHNEX") ? (
                      <Link
                        href="/technex-2k26"
                        className="px-3.5 py-1.5 rounded-lg brand-btn text-white font-bold text-xs shadow-md shadow-brand-red/20 transition-transform hover:scale-105"
                      >
                        Register Now
                      </Link>
                    ) : (
                      <Link
                        href="/membership"
                        className="px-3 py-1.5 rounded-lg bg-background-elevated border border-brand-border hover:bg-background-secondary text-xs font-semibold text-brand-secondary hover:text-brand-white transition-colors"
                      >
                        Join Event
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Quick Overview Modal ── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-background-secondary border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-brand-muted hover:text-brand-white bg-background-card border border-brand-border transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-brand-orange/20 text-brand-yellow border border-brand-orange/30">
                {selectedEvent.category}
              </span>
              <h2 className="text-2xl font-black text-brand-white mt-3">
                {selectedEvent.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-background-card border border-brand-border text-xs text-brand-secondary">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-orange" />
                <span>Date: {selectedEvent.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-orange" />
                <span>Time: {selectedEvent.time}</span>
              </div>
              <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Venue: {selectedEvent.venue}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-brand-white mb-2">Description & Highlights</h4>
              <p className="text-sm text-brand-muted leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 rounded-xl bg-background-card border border-brand-border text-brand-secondary hover:text-brand-white text-sm transition-colors"
              >
                Close
              </button>
              {selectedEvent.category === "Competition" || selectedEvent.title.includes("TECHNEX") ? (
                <Link
                  href="/technex-2k26"
                  className="px-6 py-2.5 rounded-xl brand-btn text-white font-bold text-sm shadow-md"
                >
                  Proceed to TECHNEX Form
                </Link>
              ) : (
                <Link
                  href="/membership"
                  className="px-6 py-2.5 rounded-xl brand-btn text-white font-semibold text-sm shadow-md"
                >
                  Apply via Membership
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
