"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Users, Plus, Edit2, Trash2, Upload, X, Search } from "lucide-react";
import Toast from "@/components/Toast";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

export default function AdminTeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: "",
    role: "",
    department: "Data Science",
    bio: "",
    photoUrl: "/images/logo.png",
    linkedinUrl: "",
    githubUrl: "",
    email: "",
    order: 1,
  };

  const [formData, setFormData] = useState(initialForm);

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
      }
    } catch {
      setToast({ type: "error", message: "Failed to load team" });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({ ...initialForm, order: team.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (mem) => {
    setEditingMember(mem);
    setFormData({
      name: mem.name || "",
      role: mem.role || "",
      department: mem.department || "Data Science",
      bio: mem.bio || "",
      photoUrl: mem.photoUrl || mem.avatarUrl || "/images/logo.png",
      linkedinUrl: mem.linkedinUrl || "",
      githubUrl: mem.githubUrl || "",
      email: mem.email || "",
      order: mem.order || 1,
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
      fd.append("category", "team-profile");
      fd.append("title", formData.name || file.name);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, photoUrl: data.url }));
        setToast({ type: "success", message: "Portrait photo uploaded!" });
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
      if (editingMember) {
        const res = await fetch(`/api/team/${editingMember.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setToast({ type: "success", message: "Team member updated successfully" });
          setIsModalOpen(false);
          fetchTeam();
        } else {
          setToast({ type: "error", message: data.error || "Update failed" });
        }
      } else {
        const res = await fetch("/api/team", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setToast({ type: "success", message: "Team member added successfully" });
          setIsModalOpen(false);
          fetchTeam();
        } else {
          setToast({ type: "error", message: data.error || "Creation failed" });
        }
      }
    } catch {
      setToast({ type: "error", message: "Network error saving team member" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove "${name}" from chapter team?`)) return;

    const token = localStorage.getItem("s4ds_admin_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", message: "Member removed from roster" });
        fetchTeam();
      } else {
        setToast({ type: "error", message: data.error || "Failed to remove" });
      }
    } catch {
      setToast({ type: "error", message: "Network error deleting member" });
    }
  };

  const filtered = team.filter((m) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(s) ||
      m.role.toLowerCase().includes(s) ||
      (m.department && m.department.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-white">Team & Faculty Management</h1>
          <p className="text-xs text-brand-muted">
            Maintain the executive student roster, technical mentors, and faculty advisors.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl brand-btn text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-red/30 transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by name, role, department..."
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
          title="No team members found"
          description="Click 'Add Team Member' to list a faculty lead or student officer."
          actionLabel="Add Member"
          onAction={openCreateModal}
        />
      ) : (
        <div className="w-full bg-background-card border border-brand-border rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-elevated border-b border-brand-border text-brand-secondary uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Member</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Display Order</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-background-elevated/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-brand-border bg-background-elevated shrink-0">
                        <Image
                          src={m.photoUrl || m.avatarUrl || "/images/logo.png"}
                          alt={m.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-brand-white text-sm block">{m.name}</span>
                        {m.email && <span className="text-[11px] text-brand-muted">{m.email}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-brand-yellow font-semibold">{m.role}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-background-elevated text-brand-orange border border-brand-border">
                      {m.department || "Data Science"}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-brand-muted">#{m.order}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(m)}
                        className="p-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary text-brand-secondary hover:text-brand-yellow border border-brand-border transition-colors"
                        title="Edit Member"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        className="p-1.5 rounded-lg bg-background-elevated hover:bg-[#2d1210]/60 text-brand-muted hover:text-rose-400 border border-brand-border transition-colors"
                        title="Remove Member"
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
          <div className="relative w-full max-w-xl bg-background-secondary border border-brand-border rounded-3xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-background-card text-brand-muted hover:text-brand-white border border-brand-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-brand-white">
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Role / Position *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Technical Lead"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Data Science"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Email Address</label>
                  <input
                    type="email"
                    placeholder="member@mitaoe.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-secondary">Short Bio</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-secondary">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              {/* Portrait Upload */}
              <div className="space-y-2 pt-2 border-t border-brand-border">
                <label className="text-xs font-semibold text-brand-secondary">Portrait Photo</label>
                <div className="flex items-center gap-4">
                  <label className="px-3 py-2 rounded-xl bg-background-elevated hover:bg-background-secondary border border-brand-border text-xs font-semibold text-brand-secondary hover:text-brand-white cursor-pointer flex items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-brand-orange" />
                    {uploading ? "Uploading..." : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <span className="text-[11px] text-brand-muted font-mono truncate max-w-xs">
                    {formData.photoUrl}
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
                  {submitting ? "Saving..." : editingMember ? "Save Changes" : "Add Member"}
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
