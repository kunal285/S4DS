"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Flame,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ExternalLink,
  ShieldCheck,
  X,
  Download,
  Sparkles,
} from "lucide-react";
import Toast from "@/components/Toast";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

export default function AdminRegistrationsPage() {
  const [tab, setTab] = useState("technex"); // "technex" or "membership"
  const [technexList, setTechnexList] = useState([]);
  const [membershipList, setMembershipList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [membershipFilter, setMembershipFilter] = useState("All"); // "All", "S4DS Member", "Non-S4DS Member"
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, [tab, statusFilter, membershipFilter]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("s4ds_admin_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (tab === "technex" && membershipFilter !== "All") {
        params.append("membershipType", membershipFilter);
      }

      if (tab === "technex") {
        const res = await fetch(`/api/technex?${params.toString()}`, { headers });
        const data = await res.json();
        if (data.success) {
          setTechnexList(data.data || []);
        }
      } else {
        const res = await fetch(`/api/membership?${params.toString()}`, { headers });
        const data = await res.json();
        if (data.success) {
          setMembershipList(data.data || []);
        }
      }
    } catch {
      setToast({ type: "error", message: "Failed to fetch registrations" });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem("s4ds_admin_token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const url = tab === "technex" ? `/api/technex/${id}` : `/api/membership/${id}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", message: `Status updated to ${newStatus}` });
        if (selectedRecord && selectedRecord.id === id) {
          setSelectedRecord({ ...selectedRecord, status: newStatus });
        }
        fetchData();
      } else {
        setToast({ type: "error", message: data.error || "Update failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error updating status" });
    }
  };

  const currentList = tab === "technex" ? technexList : membershipList;

  const filtered = currentList.filter((item) => {
    // Membership filter for TECHNEX
    if (tab === "technex" && membershipFilter !== "All") {
      if (item.membershipType !== membershipFilter) return false;
    }

    if (!search) return true;
    const s = search.toLowerCase();
    if (tab === "technex") {
      return (
        item.id?.toLowerCase().includes(s) ||
        (item.registrationCode && item.registrationCode.toLowerCase().includes(s)) ||
        item.teamName?.toLowerCase().includes(s) ||
        item.projectTitle?.toLowerCase().includes(s) ||
        item.leaderName?.toLowerCase().includes(s) ||
        item.leaderEmail?.toLowerCase().includes(s) ||
        item.leaderPrn?.toLowerCase().includes(s) ||
        item.domain?.toLowerCase().includes(s)
      );
    } else {
      return (
        item.fullName?.toLowerCase().includes(s) ||
        item.email?.toLowerCase().includes(s) ||
        item.prn?.toLowerCase().includes(s) ||
        item.department?.toLowerCase().includes(s) ||
        (item.transactionId && item.transactionId.toLowerCase().includes(s))
      );
    }
  });

  const handleExportCSV = () => {
    if (tab === "technex") {
      const headers = [
        "Registration ID",
        "Registration Code",
        "Team Name",
        "Project Title",
        "Domain / Track",
        "Membership Category",
        "Registration Fee (INR)",
        "UPI / UTR Number",
        "Payment Screenshot URL",
        "Leader Name",
        "Leader Email",
        "Leader Phone",
        "Leader PRN",
        "Leader College",
        "Team Size",
        "Additional Members",
        "Status",
        "Registration Timestamp",
      ];

      const rows = filtered.map((item) => {
        const addMembers = (item.teamMembers || [])
          .map((m) => `${m.name} (${m.email || ""}${m.prn ? " - " + m.prn : ""})`)
          .join("; ");

        return [
          `"${item.id || ""}"`,
          `"${item.registrationCode || ""}"`,
          `"${(item.teamName || "").replace(/"/g, '""')}"`,
          `"${(item.projectTitle || "").replace(/"/g, '""')}"`,
          `"${(item.domain || "").replace(/"/g, '""')}"`,
          `"${item.membershipType || "Non-S4DS Member"}"`,
          item.registrationFee ?? 49,
          `"${item.utr || item.upiTransactionId || ""}"`,
          `"${item.paymentScreenshotUrl || ""}"`,
          `"${(item.leaderName || "").replace(/"/g, '""')}"`,
          `"${item.leaderEmail || ""}"`,
          `"${item.leaderPhone || ""}"`,
          `"${item.leaderPrn || ""}"`,
          `"${(item.leaderCollege || "").replace(/"/g, '""')}"`,
          1 + (item.teamMembers?.length || 0),
          `"${addMembers.replace(/"/g, '""')}"`,
          `"${item.status || "Registered"}"`,
          `"${item.createdAt || ""}"`,
        ];
      });

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `technex-2k26-registrations-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToast({ type: "success", message: `Exported ${filtered.length} TECHNEX registrations to CSV!` });
    } else {
      const headers = [
        "Registration ID",
        "Full Name",
        "Email",
        "Phone",
        "PRN",
        "Department",
        "Academic Year",
        "Membership Plan",
        "Status",
        "Transaction ID",
        "Registered At",
      ];

      const rows = filtered.map((item) => [
        `"${item.id || ""}"`,
        `"${(item.fullName || "").replace(/"/g, '""')}"`,
        `"${item.email || ""}"`,
        `"${item.phone || ""}"`,
        `"${item.prn || ""}"`,
        `"${(item.department || "").replace(/"/g, '""')}"`,
        `"${item.academicYear || ""}"`,
        `"${item.membershipPlan || ""}"`,
        `"${item.status || "Pending"}"`,
        `"${item.transactionId || ""}"`,
        `"${item.createdAt || ""}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `s4ds-memberships-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToast({ type: "success", message: `Exported ${filtered.length} membership applications to CSV!` });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-white">Registrations Management</h1>
          <p className="text-xs text-brand-muted">
            Inspect team entries, filter by membership categories, manage approvals, and export to CSV.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filtered.length === 0}
          className="px-4 py-2.5 rounded-xl bg-background-elevated hover:bg-background-secondary text-brand-yellow hover:text-white border border-brand-orange/40 text-xs font-bold flex items-center gap-2 transition-all shadow-md self-start sm:self-auto disabled:opacity-40"
        >
          <Download className="w-4 h-4 text-brand-orange" /> Export {tab === "technex" ? "TECHNEX" : "Members"} to CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border gap-6">
        <button
          onClick={() => {
            setTab("technex");
            setSearch("");
          }}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            tab === "technex"
              ? "border-brand-orange text-brand-orange"
              : "border-transparent text-brand-muted hover:text-brand-white"
          }`}
        >
          <Flame className="w-4 h-4" /> TECHNEX 2K26 Teams ({technexList.length})
        </button>
        <button
          onClick={() => {
            setTab("membership");
            setSearch("");
          }}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            tab === "membership"
              ? "border-brand-orange text-brand-orange"
              : "border-transparent text-brand-muted hover:text-brand-white"
          }`}
        >
          <Users className="w-4 h-4" /> Chapter Memberships ({membershipList.length})
        </button>
      </div>

      {/* Toolbar: Filters & Search */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background-card border border-brand-border">
            <span className="text-[10px] font-bold text-brand-muted uppercase px-2">Status:</span>
            {["All", "Approved", "Pending", "Rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  statusFilter === st
                    ? "bg-background-elevated text-brand-white border border-brand-border font-bold"
                    : "text-brand-muted hover:text-brand-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Membership Category Filter (Exclusive to TECHNEX) */}
          {tab === "technex" && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background-card border border-brand-orange/30">
              <span className="text-[10px] font-bold text-brand-orange uppercase px-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-yellow" /> Category:
              </span>
              {[
                { label: "All", value: "All" },
                { label: "S4DS (₹49)", value: "S4DS Member" },
                { label: "Non-S4DS (₹99)", value: "Non-S4DS Member" },
              ].map((c) => (
                <button
                  key={c.value}
                  onClick={() => setMembershipFilter(c.value)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    membershipFilter === c.value
                      ? "bg-brand-orange/20 text-brand-yellow border border-brand-orange/40 font-bold"
                      : "text-brand-muted hover:text-brand-white"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input (By Registration ID, Team, Leader, PRN, etc.) */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={tab === "technex" ? "Search by Reg ID, Team, Leader, PRN..." : "Search name, PRN, email..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background-elevated border border-brand-border text-brand-white placeholder-brand-muted focus:outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      {/* List / Table */}
      {loading ? (
        <LoadingSkeleton count={4} type="table" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`No ${tab === "technex" ? "TECHNEX" : "membership"} registrations found`}
          description="Submissions received via public forms will appear here in real time."
        />
      ) : tab === "technex" ? (
        /* TECHNEX Teams Table */
        <div className="w-full bg-background-card border border-brand-border rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-elevated border-b border-brand-border text-brand-secondary uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Registration ID / Team</th>
                <th className="px-4 py-3.5">Project Title</th>
                <th className="px-4 py-3.5">Track / Domain</th>
                <th className="px-4 py-3.5">Leader Coordinates</th>
                <th className="px-4 py-3.5">Membership Category</th>
                <th className="px-4 py-3.5">Registration Fee</th>
                <th className="px-4 py-3.5">UPI / UTR</th>
                <th className="px-4 py-3.5">Payment Proof</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-background-elevated/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-brand-yellow font-bold block text-sm">
                      {item.registrationCode || item.id}
                    </span>
                    <span className="font-bold text-brand-white text-sm">{item.teamName}</span>
                    <span className="text-[11px] text-brand-muted block">
                      {1 + (item.teamMembers?.length || 0)} Members
                    </span>
                  </td>
                  <td className="px-4 py-4 text-brand-secondary font-medium max-w-xs truncate">
                    {item.projectTitle}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-background-elevated text-brand-orange border border-brand-border">
                      {item.domain}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-brand-secondary">
                    <div className="font-bold text-brand-white">{item.leaderName}</div>
                    <div className="text-[11px] text-brand-muted">{item.leaderEmail}</div>
                    <div className="text-[11px] text-brand-muted font-mono">PRN: {item.leaderPrn}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold bg-background-elevated text-brand-yellow border border-brand-orange/40">
                      {item.membershipType || "Non-S4DS Member"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono font-black text-brand-white text-sm">
                      ₹{item.registrationFee ?? (item.membershipType === "S4DS Member" ? 49 : 99)}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-brand-yellow">
                    {item.utr || item.upiTransactionId || "N/A"}
                  </td>
                  <td className="px-4 py-4">
                    {item.paymentScreenshotUrl ? (
                      <a
                        href={item.paymentScreenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background-elevated hover:bg-[#302016] text-brand-orange hover:text-brand-yellow border border-brand-border text-[10px] font-semibold transition-colors"
                        title="View Payment Screenshot"
                      >
                        <ExternalLink className="w-3 h-3" /> View Proof
                      </a>
                    ) : (
                      <span className="text-[10px] text-brand-muted">None</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                        item.status === "Approved" || item.status === "Successfully Registered"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : item.status === "Rejected"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-brand-orange/20 text-brand-yellow border border-brand-orange/40"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {item.status || "Registered"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedRecord(item)}
                      className="p-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary text-brand-secondary hover:text-brand-white border border-brand-border transition-colors"
                      title="Inspect Team Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Membership Applications Table */
        <div className="w-full bg-background-card border border-brand-border rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-elevated border-b border-brand-border text-brand-secondary uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5">PRN / Roll No</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Academic Year</th>
                <th className="px-4 py-3.5">Transaction ID</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Verify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-background-elevated/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-brand-white text-sm">{item.fullName}</div>
                    <div className="text-[11px] text-brand-muted">{item.email}</div>
                    <div className="text-[11px] text-brand-muted">{item.phone}</div>
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-brand-white">{item.prn}</td>
                  <td className="px-4 py-4 text-brand-secondary">{item.department}</td>
                  <td className="px-4 py-4 text-brand-secondary">{item.academicYear}</td>
                  <td className="px-4 py-4 font-mono text-brand-secondary">{item.transactionId}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === "Approved"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : item.status === "Rejected"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-brand-orange/20 text-brand-yellow border border-brand-orange/40"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedRecord(item)}
                      className="p-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary text-brand-secondary hover:text-brand-white border border-brand-border transition-colors"
                      title="Inspect Application"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Inspect Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-background-secondary border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-background-card text-brand-muted hover:text-brand-white border border-brand-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                {tab === "technex" ? "TECHNEX 2K26 Entry" : "Membership Application"}
              </span>
              <h2 className="text-2xl font-black text-brand-white mt-1">
                {tab === "technex" ? selectedRecord.teamName : selectedRecord.fullName}
              </h2>
            </div>

            {/* Quick Status Bar */}
            {tab === "membership" ? (
              <div className="p-4 rounded-xl bg-background-elevated border border-brand-border flex items-center justify-between">
                <span className="text-xs text-brand-secondary">Membership Approval Status:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedRecord.id, "Approved")}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRecord.id, "Rejected")}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRecord.id, "Pending")}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Pending
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-background-elevated border border-brand-orange/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">Direct Registration Confirmed</span>
                    <span className="text-[10px] text-brand-muted">Recorded in RushDB • No payment approval required</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 w-fit">
                  Successfully Registered
                </span>
              </div>
            )}

            {/* Content Details */}
            {tab === "technex" ? (
              <div className="space-y-4 text-xs">
                {/* Registration Code, Fee & Submission Timestamp */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-background-elevated border border-brand-border text-brand-secondary">
                  <div>
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Registration Code:</span>
                    <span className="text-brand-yellow font-black text-base font-mono">
                      {selectedRecord.registrationCode || selectedRecord.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Membership & Fee:</span>
                    <span className="text-brand-white font-bold text-xs">
                      {selectedRecord.membershipType || "Non-S4DS Member"} (₹{selectedRecord.registrationFee ?? 49})
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Registered On:</span>
                    <span className="text-brand-secondary text-xs">
                      {selectedRecord.createdAt ? new Date(selectedRecord.createdAt).toLocaleString("en-IN") : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Payment Proof & Transaction Details */}
                <div className="p-4 rounded-xl bg-background-elevated border border-brand-border space-y-3">
                  <span className="font-bold text-brand-white block text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-orange" /> Payment Proof &amp; Transaction Details:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#17110D] border border-brand-border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-brand-muted block">UPI Transaction ID / UTR:</span>
                      <span className="font-mono font-bold text-brand-yellow text-sm block">
                        {selectedRecord.utr || selectedRecord.upiTransactionId || "Not Provided"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#17110D] border border-brand-border space-y-1">
                      <span className="text-[10px] uppercase font-bold text-brand-muted block">Fee Recorded:</span>
                      <span className="font-mono font-bold text-white text-sm block">
                        ₹{selectedRecord.registrationFee ?? (selectedRecord.membershipType === "S4DS Member" ? 49 : 99)} ({selectedRecord.membershipType})
                      </span>
                    </div>
                  </div>

                  {selectedRecord.paymentScreenshotUrl ? (
                    <div className="space-y-2 pt-2 border-t border-brand-border">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-brand-white">Payment Screenshot Proof:</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={selectedRecord.paymentScreenshotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded bg-[#17110D] hover:bg-[#251710] text-brand-orange hover:text-brand-yellow border border-brand-border text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" /> View Full Image
                          </a>
                          <a
                            href={selectedRecord.paymentScreenshotUrl}
                            download={`technex-payment-${selectedRecord.registrationCode || selectedRecord.id}.png`}
                            className="px-2.5 py-1 rounded bg-[#17110D] hover:bg-[#251710] text-brand-secondary hover:text-white border border-brand-border text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3 h-3" /> Download
                          </a>
                        </div>
                      </div>

                      <div className="relative w-full h-64 rounded-xl overflow-hidden border border-brand-border bg-black/60">
                        <Image
                          src={selectedRecord.paymentScreenshotUrl}
                          alt={`Payment proof for ${selectedRecord.teamName}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-[#17110D] border border-brand-border text-xs text-brand-muted">
                      No payment screenshot attached for this record.
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-background-elevated border border-brand-border space-y-2">
                  <div className="text-sm font-bold text-brand-white">{selectedRecord.projectTitle}</div>
                  <div className="text-brand-orange font-semibold">{selectedRecord.domain}</div>
                  {selectedRecord.abstractSummary && (
                    <p className="text-brand-secondary leading-relaxed pt-1">
                      {selectedRecord.abstractSummary}
                    </p>
                  )}
                  {selectedRecord.githubOrDriveUrl && (
                    <div className="pt-2">
                      <a
                        href={selectedRecord.githubOrDriveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-orange hover:text-brand-yellow hover:underline flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Repository / Project Link
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-background-elevated border border-brand-border space-y-2">
                  <span className="font-bold text-brand-white block">Team Leader:</span>
                  <div className="grid grid-cols-2 gap-2 text-brand-secondary">
                    <div>Name: {selectedRecord.leaderName}</div>
                    <div>Email: {selectedRecord.leaderEmail}</div>
                    <div>Phone: {selectedRecord.leaderPhone}</div>
                    <div>PRN: {selectedRecord.leaderPrn}</div>
                    <div className="col-span-2">College: {selectedRecord.leaderCollege}</div>
                  </div>
                </div>

                {selectedRecord.teamMembers?.length > 0 && (
                  <div className="p-4 rounded-xl bg-background-elevated border border-brand-border space-y-2">
                    <span className="font-bold text-brand-white block">
                      Additional Members ({selectedRecord.teamMembers.length}):
                    </span>
                    {selectedRecord.teamMembers.map((m, i) => (
                      <div key={i} className="text-brand-secondary border-t border-brand-border pt-2 grid grid-cols-2 gap-1">
                        <div>#{i + 2}: {m.name}</div>
                        <div>Email: {m.email}</div>
                        <div>PRN: {m.prn}</div>
                        <div>Phone: {m.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-background-elevated border border-brand-border space-y-3 text-xs text-brand-secondary">
                  <div className="grid grid-cols-2 gap-3">
                    <div>Full Name: <span className="font-bold text-brand-white">{selectedRecord.fullName}</span></div>
                    <div>PRN: <span className="font-mono font-bold text-brand-white">{selectedRecord.prn}</span></div>
                    <div>Email: {selectedRecord.email}</div>
                    <div>Phone: {selectedRecord.phone}</div>
                    <div>Department: {selectedRecord.department}</div>
                    <div>Academic Year: {selectedRecord.academicYear}</div>
                    <div>Plan: {selectedRecord.membershipPlan}</div>
                    <div>Transaction ID: {selectedRecord.transactionId}</div>
                  </div>
                </div>

                {selectedRecord.paymentProofUrl && (
                  <div className="p-4 rounded-xl bg-background-elevated border border-brand-border space-y-2">
                    <span className="font-bold text-brand-white block">Payment Proof Screenshot:</span>
                    <a
                      href={selectedRecord.paymentProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-orange hover:text-brand-yellow hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View Receipt
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 rounded-xl bg-background-card border border-brand-border text-brand-secondary hover:text-brand-white text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
