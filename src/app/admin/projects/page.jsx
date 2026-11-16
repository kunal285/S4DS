"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Code2,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Search,
  ExternalLink,
  Github,
  Sparkles,
  Layers,
} from "lucide-react";
import Toast from "@/components/Toast";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const domains = [
    "Artificial Intelligence & ML",
    "Data Science & Predictive Analytics",
    "Web3 & Decentralized Apps",
    "IoT, Robotics & Embedded Systems",
    "Cloud Architecture & DevOps",
    "Open Track: Interdisciplinary Innovation",
  ];

  const initialForm = {
    title: "",
    domain: "Artificial Intelligence & ML",
    category: "AI / Data Science",
    description: "",
    techStack: "",
    authors: "",
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    isFeatured: true,
    order: 1,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch {
      setToast({ type: "error", message: "Failed to load projects from RushDB" });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({ ...initialForm, order: projects.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || "",
      domain: proj.domain || domains[0],
      category: proj.category || "",
      description: proj.description || "",
      techStack: Array.isArray(proj.techStack) ? proj.techStack.join(", ") : (proj.techStack || ""),
      authors: Array.isArray(proj.authors) ? proj.authors.join(", ") : (proj.authors || ""),
      githubUrl: proj.githubUrl || "",
      liveUrl: proj.liveUrl || "",
      imageUrl: proj.imageUrl || "",
      isFeatured: proj.isFeatured !== false,
      order: proj.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("category", "project-image");
      form.append("title", `${formData.title || "Project"} Thumbnail`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (res.ok && data.fileUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: data.fileUrl }));
        setToast({ type: "success", message: "Project thumbnail uploaded to Supabase Storage!" });
      } else {
        setToast({ type: "error", message: data.error || "Failed to upload image" });
      }
    } catch {
      setToast({ type: "error", message: "Network error during upload" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("s4ds_admin_token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const payload = {
      ...formData,
      techStack: formData.techStack
        ? formData.techStack.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      authors: formData.authors
        ? formData.authors.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      order: Number(formData.order) || 1,
      isFeatured: Boolean(formData.isFeatured),
    };

    try {
      let res;
      if (editingProject) {
        res = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (res.ok && json.success) {
        setToast({
          type: "success",
          message: editingProject ? "Project updated in RushDB!" : "Project created in RushDB!",
        });
        setIsModalOpen(false);
        fetchProjects();
      } else {
        setToast({ type: "error", message: json.error || "Operation failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error while saving project" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("s4ds_admin_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setToast({ type: "success", message: "Project deleted from RushDB" });
        fetchProjects();
      } else {
        setToast({ type: "error", message: json.error || "Delete failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error while deleting project" });
    }
  };

  const filtered = projects.filter((p) => {
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(p.authors) && p.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())));
    const matchDomain = selectedDomain === "All" || p.domain === selectedDomain;
    return matchSearch && matchDomain;
  });

  return (
    <div className="space-y-8">
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <h1 className="text-2xl font-black text-brand-white flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-brand-orange" /> Projects &amp; Innovations Manager
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Manage student engineering prototypes, research papers, and technical projects stored in RushDB.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl brand-btn text-xs font-bold flex items-center gap-2 self-start shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Filters Strip */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-background-card border border-brand-border text-xs text-brand-white focus:outline-none focus:border-brand-orange"
          />
        </div>

        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="px-3 py-2 rounded-xl bg-background-card border border-brand-border text-xs text-brand-white focus:outline-none focus:border-brand-orange"
        >
          <option value="All">All Domains</option>
          {domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No Projects Found"
          message={search ? "No projects match your query." : "No projects in the database. Add your first project!"}
          actionLabel={search ? "Clear Search" : "Add Project"}
          onAction={search ? () => setSearch("") : openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl bg-background-card border border-brand-border overflow-hidden hover:border-brand-orange/40 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="relative h-44 w-full bg-background-elevated">
                  {proj.imageUrl ? (
                    <Image
                      src={proj.imageUrl}
                      alt={proj.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-brand-muted">
                      No Image Provided
                    </div>
                  )}
                  {proj.isFeatured && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-brand-orange/90 text-white shadow-md">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">
                    {proj.domain}
                  </div>
                  <h3 className="font-bold text-sm text-brand-white leading-snug">
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
                    <div className="text-[11px] text-brand-secondary pt-1">
                      <strong className="text-brand-muted">Team: </strong>
                      {proj.authors.join(", ")}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-background-elevated/50 border-t border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-background-card hover:bg-background-elevated text-brand-muted hover:text-brand-white border border-brand-border"
                      title="GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-background-card hover:bg-background-elevated text-brand-muted hover:text-brand-white border border-brand-border"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-1.5 rounded-lg bg-background-card hover:bg-brand-orange/20 text-brand-secondary hover:text-brand-yellow border border-brand-border"
                    title="Edit Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    title="Delete Project"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border shadow-2xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-brand-muted hover:text-white bg-background-elevated"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-brand-white mb-6 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-orange" />
              {editingProject ? "Edit Project" : "Add New Student Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NeuroScan MRI Segmentation"
                  className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-secondary">Domain Track *</label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                  >
                    {domains.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-secondary">Category / Subtitle</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. AI / Healthcare"
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe problem, methodology, and innovation..."
                  className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="e.g. PyTorch, FastAPI, Next.js, Docker"
                  className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">
                  Authors / Team Members (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  placeholder="e.g. Harsh Holkar, Sameet Pisal"
                  className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-secondary">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-secondary">Live Demo / Paper URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2 pt-2 border-t border-brand-border">
                <label className="text-xs font-semibold text-brand-secondary flex items-center justify-between">
                  <span>Project Image (Supabase Storage)</span>
                  {uploading && <span className="text-[10px] text-brand-orange animate-pulse">Uploading...</span>}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Image URL or upload from device"
                    className="flex-1 px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                  <label className="px-3 py-2 rounded-xl bg-background-elevated hover:bg-[#302016] text-xs font-semibold text-brand-secondary hover:text-white border border-brand-border cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-secondary">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-orange focus:ring-0 bg-background-elevated border-brand-border"
                  />
                  <span>Feature on Homepage / Project Showcase</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl brand-btn text-xs font-bold text-white shadow-md disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
