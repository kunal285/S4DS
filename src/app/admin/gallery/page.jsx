"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Plus, Edit2, Trash2, Upload, X, Search } from "lucide-react";
import Toast from "@/components/Toast";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: "",
    category: "Expos",
    eventName: "TECHNEX 2K26",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    caption: "",
    date: new Date().toISOString().split("T")[0],
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
      }
    } catch {
      setToast({ type: "error", message: "Failed to load gallery" });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      category: item.category || "Expos",
      eventName: item.eventName || "",
      imageUrl: item.imageUrl || "",
      caption: item.caption || "",
      date: item.date || "",
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
      fd.append("category", "event-gallery");
      fd.append("title", formData.title || file.name);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        setToast({ type: "success", message: "Photo uploaded successfully!" });
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
      if (editingItem) {
        const res = await fetch(`/api/gallery/${editingItem.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setToast({ type: "success", message: "Gallery item updated" });
          setIsModalOpen(false);
          fetchGallery();
        } else {
          setToast({ type: "error", message: data.error || "Update failed" });
        }
      } else {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setToast({ type: "success", message: "Gallery item created" });
          setIsModalOpen(false);
          fetchGallery();
        } else {
          setToast({ type: "error", message: data.error || "Creation failed" });
        }
      }
    } catch {
      setToast({ type: "error", message: "Network error saving photo" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete gallery image "${title}"?`)) return;

    const token = localStorage.getItem("s4ds_admin_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", message: "Item deleted" });
        fetchGallery();
      } else {
        setToast({ type: "error", message: data.error || "Delete failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error deleting item" });
    }
  };

  const filtered = items.filter((i) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return i.title.toLowerCase().includes(s) || i.category.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-white">Gallery Management</h1>
          <p className="text-xs text-brand-muted">
            Curate campus events, competition ceremonies, and workshop memories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl brand-btn text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-red/30 transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by title, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background-elevated border border-brand-border text-brand-white placeholder-brand-muted focus:outline-none focus:border-brand-orange"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSkeleton count={3} type="card" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No photos found"
          description="Click 'Add Photo' to upload a milestone picture."
          actionLabel="Add Photo"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-background-card border border-brand-border overflow-hidden hover:border-brand-border-hover transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="relative h-44 bg-background-elevated">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-background-secondary/90 text-brand-orange border border-brand-border">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-brand-white text-sm line-clamp-1">{item.title}</h3>
                <div className="text-[11px] text-brand-secondary flex justify-between">
                  <span>{item.date}</span>
                  <span className="text-brand-yellow font-medium">{item.eventName}</span>
                </div>

                <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary text-brand-secondary hover:text-brand-yellow border border-brand-border transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg bg-background-elevated hover:bg-[#2d1210]/60 text-brand-muted hover:text-rose-400 border border-brand-border transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-background-secondary border border-brand-border rounded-3xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-background-card text-brand-muted hover:text-brand-white border border-brand-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-brand-white">
              {editingItem ? "Edit Gallery Item" : "Upload Gallery Photo"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-secondary">Title / Caption Title *</label>
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
                  <label className="text-xs font-semibold text-brand-secondary">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange cursor-pointer"
                  >
                    <option value="Expos">Expos</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Event Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. TECHNEX 2K26"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-secondary">Detailed Caption</label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Upload */}
              <div className="space-y-2 pt-2 border-t border-brand-border">
                <label className="text-xs font-semibold text-brand-secondary">Image File</label>
                <div className="flex items-center gap-4">
                  <label className="px-3 py-2 rounded-xl bg-background-elevated hover:bg-background-secondary border border-brand-border text-xs font-semibold text-brand-secondary hover:text-brand-white cursor-pointer flex items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-brand-orange" />
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <span className="text-[11px] text-brand-muted font-mono truncate max-w-xs">
                    {formData.imageUrl}
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
                  {submitting ? "Saving..." : editingItem ? "Save Changes" : "Save Photo"}
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
