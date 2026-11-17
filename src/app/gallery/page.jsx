"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Calendar, X, ZoomIn } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [activeModal, setActiveModal] = useState(null);

  const categories = ["All", "Expos", "Workshops", "Community"];

  useEffect(() => {
    fetchGallery();
  }, [category]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.append("category", category);

      const res = await fetch(`/api/gallery?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
      } else {
        setError(data.error || "Failed to load gallery");
      }
    } catch (err) {
      setError("Network error loading gallery.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* ── Page Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-border text-xs font-bold text-brand-orange uppercase tracking-wider">
          <ImageIcon className="w-4 h-4 text-brand-yellow" /> Moments & Milestones
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-brand-white tracking-tight">
          Life at <span className="brand-text-gradient">S4DS MITAOE</span>
        </h1>
        <p className="text-base sm:text-lg text-brand-secondary">
          A visual record of our annual project expos, technical bootcamps, orientation meets, and hackathons.
        </p>
      </div>

      {/* ── Category Filters ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-3 rounded-2xl bg-background-card border border-brand-border max-w-lg mx-auto shadow-md">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              category === cat
                ? "bg-brand-orange text-white shadow-md shadow-brand-red/20 font-bold"
                : "bg-background-elevated text-brand-secondary hover:text-brand-white border border-brand-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Gallery Grid ── */}
      {loading ? (
        <LoadingSkeleton count={6} type="card" />
      ) : error ? (
        <div className="p-8 text-center text-rose-400 rounded-2xl bg-background-card border border-rose-500/30">
          {error}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No photos in this category"
          description="Photos for this segment will be added after upcoming campus activities."
          actionLabel="View All"
          onAction={() => setCategory("All")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModal(item)}
              className="group relative rounded-3xl overflow-hidden bg-background-card border border-brand-border cursor-pointer hover:border-brand-border-hover transition-all aspect-[4/3] shadow-lg"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-main/95 via-background-main/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-background-secondary/90 text-brand-orange backdrop-blur-md border border-brand-border">
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-background-secondary/90 border border-brand-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4 text-brand-yellow" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-brand-white mb-1 group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-brand-secondary">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{item.date}</span>
                    {item.eventName && (
                      <>
                        <span>•</span>
                        <span className="text-brand-yellow font-medium">{item.eventName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Image Lightbox Modal ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-background-secondary border border-brand-border rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-background-card/90 text-brand-secondary hover:text-brand-white border border-brand-border transition-colors"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-[60vh] w-full bg-black">
              <Image
                src={activeModal.imageUrl}
                alt={activeModal.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-background-secondary space-y-2 border-t border-brand-border">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-brand-orange/20 text-brand-yellow border border-brand-orange/30">
                  {activeModal.category}
                </span>
                <span className="text-xs text-brand-muted">{activeModal.date}</span>
              </div>
              <h2 className="text-xl font-bold text-brand-white">{activeModal.title}</h2>
              {activeModal.caption && (
                <p className="text-sm text-brand-secondary">{activeModal.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
