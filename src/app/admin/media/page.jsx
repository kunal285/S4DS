"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Upload,
  Search,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  FolderOpen,
  Filter,
  Eye,
  FileText,
  ShieldCheck,
  Layers,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  UserCheck,
  Flag,
  FileCode,
  Tag,
  Calendar,
  HardDrive,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown,
  X,
} from "lucide-react";

const CATEGORIES = [
  { id: "payment-qr", label: "Payment QR Codes", icon: QrCode, folder: "payment/qr-codes" },
  { id: "payment-screenshot", label: "Payment Screenshots", icon: ShieldCheck, folder: "payment/screenshots" },
  { id: "event-poster", label: "Event Posters", icon: Calendar, folder: "events/posters" },
  { id: "event-gallery", label: "Event Gallery", icon: ImageIcon, folder: "events/gallery" },
  { id: "team-profile", label: "Team Profiles", icon: UserCheck, folder: "team/profiles" },
  { id: "project-image", label: "Project Images", icon: FileCode, folder: "projects/thumbnails" },
  { id: "website-banner", label: "Website Banners", icon: Flag, folder: "website/banners" },
  { id: "logo", label: "Logos", icon: Tag, folder: "website/logos" },
  { id: "document", label: "Documents", icon: FileText, folder: "documents/resources" },
];

export default function AdminMediaManager() {
  const [selectedCategory, setSelectedCategory] = useState("payment-qr");
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [replaceTargetId, setReplaceTargetId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // New Upload Form State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadIsActive, setUploadIsActive] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, [selectedCategory]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("s4ds_admin_token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?category=${selectedCategory}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMediaList(data.data || []);
      } else {
        setMediaList([]);
      }
    } catch (err) {
      console.error("Error fetching media assets:", err);
      showToast("error", "Failed to fetch media assets from Supabase & RushDB.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, targetId = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", selectedCategory);
      formData.append("title", uploadTitle.trim() || file.name);
      formData.append("isActive", uploadIsActive ? "true" : "false");

      // 1. Upload file to Supabase Storage & register in RushDB
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Upload failed");
      }

      // If this was a replacement, delete the old item
      if (targetId) {
        await fetch(`/api/media/${targetId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        showToast("success", "Asset replaced and synchronized in Supabase Storage & RushDB!");
      } else {
        showToast("success", "Asset uploaded to Supabase Storage and stored in RushDB!");
      }

      setUploadTitle("");
      setUploadIsActive(false);
      setReplaceTargetId(null);
      fetchMedia();
    } catch (err) {
      console.error("Upload error:", err);
      showToast("error", err.message || "Failed to upload file to Supabase Storage.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const updatedStatus = !item.isActive;
      const res = await fetch(`/api/media/${item.id}`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: item.category,
          isActive: updatedStatus,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast("success", `Asset marked as ${updatedStatus ? "Active" : "Inactive"}`);
        fetchMedia();
      } else {
        throw new Error(json.error || "Update failed");
      }
    } catch (err) {
      showToast("error", err.message || "Could not update asset status in RushDB.");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" permanently from Supabase Storage and RushDB?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("success", "Asset permanently deleted from Supabase Storage and RushDB.");
        fetchMedia();
      } else {
        throw new Error(json.error || "Deletion failed");
      }
    } catch (err) {
      showToast("error", err.message || "Could not delete asset.");
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
    showToast("success", "Storage URL copied to clipboard!");
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
  const CategoryIcon = currentCategoryObj.icon;

  const filteredMedia = useMemo(() => {
    if (!searchQuery.trim()) return mediaList;
    const q = searchQuery.toLowerCase();
    return mediaList.filter(
      (m) =>
        m.title?.toLowerCase().includes(q) ||
        m.fileName?.toLowerCase().includes(q) ||
        m.storagePath?.toLowerCase().includes(q)
    );
  }, [mediaList, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all ${
            toast.type === "success"
              ? "bg-green-950/90 border-green-500/50 text-green-200"
              : "bg-red-950/90 border-red-500/50 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl -z-10" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg bg-brand-red/20 text-brand-yellow border border-brand-red/30">
              Supabase Storage & RushDB Primary
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-background-elevated text-brand-muted border border-brand-border">
              s4ds-media bucket
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-white tracking-tight flex items-center gap-3">
            <FolderOpen className="w-7 h-7 text-brand-orange" />
            Media & Asset Manager
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl leading-relaxed">
            Centralized file storage powered by <strong>Supabase Storage</strong> and metadata cataloged in <strong>RushDB</strong>.
            Manage live payment QR codes, event banners, team photos, and verified applicant proofs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border hover:border-brand-orange text-brand-secondary hover:text-brand-white text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-brand-orange" : ""}`} />
            Sync from RushDB
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-gradient-to-r from-brand-red to-brand-orange text-white border-transparent shadow-lg shadow-brand-red/20 scale-[1.02]"
                  : "bg-background-card hover:bg-background-elevated text-brand-secondary hover:text-brand-white border-brand-border"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Upload Zone & Category Summary */}
      <div className="p-6 rounded-3xl bg-background-card border border-brand-border space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange">
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-brand-white">
                {currentCategoryObj.label}
              </h3>
              <span className="text-xs font-mono text-brand-muted">
                Storage Path: s4ds-media/{currentCategoryObj.folder}/
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <span className="font-bold text-brand-white">{filteredMedia.length}</span> assets registered
          </div>
        </div>

        {/* Upload Action Form */}
        <div className="pt-4 border-t border-brand-border grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-brand-muted">Asset Title / Label (Optional)</label>
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder={`e.g. Official S4DS ${currentCategoryObj.label}`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background-elevated border border-brand-border focus:border-brand-orange focus:outline-none text-xs text-brand-white"
            />
          </div>

          <div className="lg:col-span-3 flex items-center gap-2 py-2.5">
            <label className="text-xs text-brand-secondary flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={uploadIsActive}
                onChange={(e) => setUploadIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-orange focus:ring-0 bg-background-elevated"
              />
              <span>Set as Active / Live Asset</span>
            </label>
          </div>

          <div className="lg:col-span-4 flex items-center gap-2">
            <label className="w-full relative cursor-pointer">
              <input
                type="file"
                className="sr-only"
                onChange={(e) => handleFileUpload(e)}
                disabled={uploading}
                accept="image/*,application/pdf"
              />
              <div className="w-full py-2.5 px-4 rounded-xl brand-btn text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-transform">
                <Upload className={`w-4 h-4 ${uploading ? "animate-bounce" : ""}`} />
                <span>{uploading ? "Uploading to Supabase..." : `Upload to ${currentCategoryObj.label}`}</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${currentCategoryObj.label}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-background-card border border-brand-border focus:border-brand-orange focus:outline-none text-xs text-brand-white placeholder:text-brand-muted"
          />
        </div>

        <div className="text-xs text-brand-muted self-end sm:self-auto">
          Showing <span className="text-brand-white font-bold">{filteredMedia.length}</span> item(s)
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-brand-muted">Fetching Supabase Storage metadata from RushDB...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-background-card border border-dashed border-brand-border space-y-4">
          <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto text-brand-orange">
            <CategoryIcon className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-brand-white">No assets in {currentCategoryObj.label}</h4>
            <p className="text-xs text-brand-muted max-w-md mx-auto mt-1">
              Upload an image or document above to store it in Supabase Storage and register its metadata in RushDB.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => {
            const isImage = item.mimeType?.startsWith("image/") || item.fileUrl?.match(/\.(jpg|jpeg|png|webp|gif|svg)/i);
            const isPrivate = item.isPrivate || item.category === "payment-screenshot";

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-background-card border border-brand-border overflow-hidden flex flex-col justify-between group hover:border-brand-border-hover hover:shadow-xl transition-all"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-video w-full bg-background-elevated overflow-hidden border-b border-brand-border flex items-center justify-center">
                  {isImage && item.fileUrl ? (
                    <img
                      src={item.fileUrl}
                      alt={item.title || item.fileName}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <FileText className="w-10 h-10 text-brand-orange mb-2" />
                      <span className="text-xs font-bold text-brand-white line-clamp-1">{item.fileName}</span>
                      <span className="text-[10px] text-brand-muted">{item.mimeType}</span>
                    </div>
                  )}

                  {/* Active Badge */}
                  {item.isActive && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/40 text-[10px] font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Live / Active</span>
                    </div>
                  )}

                  {/* Privacy Badge */}
                  {isPrivate && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold backdrop-blur-md">
                      Private
                    </div>
                  )}

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-2.5 rounded-xl bg-background-secondary/90 hover:bg-brand-orange text-brand-white text-xs font-bold transition-colors"
                      title="Preview Asset"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-background-secondary/90 hover:bg-brand-orange text-brand-white text-xs font-bold transition-colors"
                        title="Open Raw File"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => copyToClipboard(item.fileUrl || item.storagePath, item.id)}
                      className="p-2.5 rounded-xl bg-background-secondary/90 hover:bg-brand-orange text-brand-white text-xs font-bold transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Media Metadata */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-brand-white line-clamp-1 group-hover:text-brand-orange transition-colors">
                      {item.title || item.fileName}
                    </h4>
                    <p className="text-[11px] font-mono text-brand-muted truncate" title={item.storagePath}>
                      {item.storagePath}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-border text-[10px] text-brand-muted">
                    <div>
                      <span className="block text-brand-secondary font-semibold">Size:</span>
                      <span>{formatFileSize(item.fileSize)}</span>
                    </div>
                    <div>
                      <span className="block text-brand-secondary font-semibold">Uploaded:</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-brand-border flex items-center justify-between gap-2">
                    {/* Active Toggle */}
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                        item.isActive
                          ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
                          : "bg-background-elevated text-brand-muted border-brand-border hover:text-brand-white hover:border-brand-border-hover"
                      }`}
                    >
                      {item.isActive ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-green-400" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          <span>Set Active</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Replace Button */}
                      <label className="p-2 rounded-xl text-brand-muted hover:text-brand-yellow hover:bg-background-elevated transition-colors cursor-pointer" title="Replace Asset">
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleFileUpload(e, item.id)}
                          disabled={uploading}
                          accept="image/*,application/pdf"
                        />
                        <ArrowUpDown className="w-4 h-4" />
                      </label>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id, item.title || item.fileName)}
                        className="p-2 rounded-xl text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Preview */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-background-secondary border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-brand-muted hover:text-brand-white bg-background-card border border-brand-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-brand-orange/20 text-brand-yellow border border-brand-orange/30">
                {CATEGORIES.find((c) => c.id === previewItem.category)?.label || previewItem.category}
              </span>
              <h2 className="text-xl font-black text-brand-white mt-2">
                {previewItem.title || previewItem.fileName}
              </h2>
            </div>

            {/* Asset Display */}
            <div className="rounded-2xl bg-background-card border border-brand-border p-4 flex items-center justify-center max-h-[50vh] overflow-hidden">
              {previewItem.fileUrl?.match(/\.(jpg|jpeg|png|webp|gif|svg)/i) || previewItem.mimeType?.startsWith("image/") ? (
                <img
                  src={previewItem.fileUrl}
                  alt={previewItem.title}
                  className="max-h-[45vh] w-auto object-contain rounded-xl"
                />
              ) : (
                <div className="py-12 text-center space-y-3">
                  <FileText className="w-16 h-16 text-brand-orange mx-auto" />
                  <p className="text-sm font-bold text-brand-white">{previewItem.fileName}</p>
                  <p className="text-xs text-brand-muted">MIME: {previewItem.mimeType}</p>
                </div>
              )}
            </div>

            {/* Details Table */}
            <div className="p-4 rounded-xl bg-background-card border border-brand-border space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-brand-border">
                <span className="text-brand-muted">Storage Bucket:</span>
                <span className="text-brand-white font-mono">s4ds-media</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-border">
                <span className="text-brand-muted">Supabase Path:</span>
                <span className="text-brand-white font-mono break-all">{previewItem.storagePath}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-border">
                <span className="text-brand-muted">File Size:</span>
                <span className="text-brand-white">{formatFileSize(previewItem.fileSize)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-border">
                <span className="text-brand-muted">RushDB Record ID:</span>
                <span className="text-brand-white font-mono">{previewItem.id}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-brand-muted">Access Level:</span>
                <span className={previewItem.isPrivate ? "text-amber-400 font-bold" : "text-green-400 font-bold"}>
                  {previewItem.isPrivate ? "Private (Signed URL / Secure)" : "Public CDN Delivery"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => copyToClipboard(previewItem.fileUrl, previewItem.id)}
                className="px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border hover:border-brand-orange text-xs font-bold text-brand-secondary hover:text-brand-white flex items-center gap-2 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy URL</span>
              </button>
              {previewItem.fileUrl && (
                <a
                  href={previewItem.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl brand-btn text-white text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Full Asset</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
