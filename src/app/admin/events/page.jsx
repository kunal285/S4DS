"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
} from "lucide-react";
import Toast from "@/components/Toast";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: "",
    category: "Workshop",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM - 04:00 PM IST",
    venue: "MITAOE Campus, Alandi, Pune",
    description: "",
    posterUrl: "/images/technex-poster.png",
    prizePool: "",
    status: "Upcoming",
    isFeatured: false,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.data || []);
      }
    } catch {
      setToast({ type: "error", message: "Failed to load events" });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title || "",
      category: evt.category || "Workshop",
      date: evt.date || "",
      time: evt.time || "",
      venue: evt.venue || "",
      description: evt.description || "",
      posterUrl: evt.posterUrl || "/images/technex-poster.png",
      prizePool: evt.prizePool || "",
      status: evt.status || "Upcoming",
      isFeatured: Boolean(evt.isFeatured),
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "event-poster");
      fd.append("title", formData.title || file.name);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, posterUrl: data.url }));
        setToast({ type: "success", message: "Poster uploaded successfully!" });
      } else {
        setToast({ type: "error", message: data.error || "Upload failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error during upload" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("s4ds_admin_token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      if (editingEvent) {
        // Update
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setToast({ type: "success", message: "Event updated successfully" });
          setIsModalOpen(false);
          fetchEvents();
        } else {
          setToast({ type: "error", message: data.error || "Failed to update event" });
        }
      } else {
        // Create
        const res = await fetch("/api/events", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setToast({ type: "success", message: "Event created successfully" });
          setIsModalOpen(false);
          fetchEvents();
        } else {
          setToast({ type: "error", message: data.error || "Failed to create event" });
        }
      }
    } catch {
      setToast({ type: "error", message: "Network error saving event" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete event "${title}"?`)) return;

    const token = localStorage.getItem("s4ds_admin_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", message: "Event deleted successfully" });
        fetchEvents();
      } else {
        setToast({ type: "error", message: data.error || "Failed to delete" });
      }
    } catch {
      setToast({ type: "error", message: "Network error deleting event" });
    }
  };

  const filtered = events.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(s) ||
      e.category.toLowerCase().includes(s) ||
      e.venue.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-white">Events Management</h1>
          <p className="text-xs text-brand-muted">
            Publish workshops, project expos, and student competitions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl brand-btn text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-red/30 transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Create New Event
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by title, category, venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background-elevated border border-brand-border text-brand-white placeholder-brand-muted focus:outline-none focus:border-brand-orange"
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSkeleton count={4} type="table" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No events listed"
          description="Click 'Create New Event' to post a workshop or hackathon."
          actionLabel="Add Event"
          onAction={openCreateModal}
        />
      ) : (
        <div className="w-full bg-background-card border border-brand-border rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-elevated border-b border-brand-border text-brand-secondary uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Event</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Venue</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((evt) => (
                <tr key={evt.id} className="hover:bg-background-elevated/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-brand-white text-sm">{evt.title}</div>
                    {evt.isFeatured && (
                      <span className="text-[10px] text-brand-yellow font-semibold">Featured on Home</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-background-elevated text-brand-orange border border-brand-border">
                      {evt.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-brand-secondary">
                    <div className="font-medium text-brand-white">{evt.date}</div>
                    <div className="text-[11px] text-brand-muted">{evt.time}</div>
                  </td>
                  <td className="px-4 py-4 text-brand-muted max-w-xs truncate">
                    {evt.venue}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.status === "Upcoming"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-background-elevated text-brand-muted border border-brand-border"
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(evt)}
                        className="p-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary text-brand-secondary hover:text-brand-yellow border border-brand-border transition-colors"
                        title="Edit Event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id, evt.title)}
                        className="p-1.5 rounded-lg bg-background-elevated hover:bg-[#2d1210]/60 text-brand-muted hover:text-rose-400 border border-brand-border transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-background-secondary border border-brand-border rounded-3xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-background-card text-brand-muted hover:text-brand-white border border-brand-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-brand-white">
              {editingEvent ? "Edit Event Details" : "Create New Chapter Event"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-secondary">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange cursor-pointer"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Competition">Competition</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Time / Duration *</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-secondary">Venue *</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-secondary">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Prize Pool / Awards</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50,000+ or Certificate"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-orange focus:ring-0 accent-brand-orange"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-medium text-brand-secondary cursor-pointer">
                    Feature on Homepage Highlights
                  </label>
                </div>
              </div>

              {/* Poster Upload */}
              <div className="space-y-2 pt-2 border-t border-brand-border">
                <label className="text-xs font-semibold text-brand-secondary">Event Poster Image</label>
                <div className="flex items-center gap-4">
                  <label className="px-3 py-2 rounded-xl bg-background-elevated hover:bg-background-secondary border border-brand-border text-xs font-semibold text-brand-secondary hover:text-brand-white cursor-pointer flex items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-brand-orange" />
                    {uploading ? "Uploading..." : "Upload New Poster"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <span className="text-[11px] text-brand-muted font-mono truncate max-w-xs">
                    {formData.posterUrl}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-background-card border border-brand-border text-brand-secondary hover:text-brand-white text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2 rounded-xl brand-btn text-white text-xs font-bold shadow-md shadow-brand-red/30 transition-transform hover:scale-105"
                >
                  {submitting ? "Saving..." : editingEvent ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
