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
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, [tab, statusFilter, paymentFilter]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("s4ds_admin_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (tab === "technex" && paymentFilter !== "All") params.append("paymentStatus", paymentFilter);

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

  const handlePaymentVerification = async (id, newPaymentStatus) => {
    const token = localStorage.getItem("s4ds_admin_token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const correspondingStatus =
        newPaymentStatus === "Verified" ? "Approved" : newPaymentStatus === "Rejected" ? "Rejected" : "Pending";

      const res = await fetch(`/api/technex/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          paymentStatus: newPaymentStatus,
          status: correspondingStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", message: `Payment marked as ${newPaymentStatus}` });
        if (selectedRecord && selectedRecord.id === id) {
          setSelectedRecord({
            ...selectedRecord,
            paymentStatus: newPaymentStatus,
            status: correspondingStatus,
          });
        }
        fetchData();
      } else {
        setToast({ type: "error", message: data.error || "Payment verification failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error during payment verification" });
    }
  };

  const currentList = tab === "technex" ? technexList : membershipList;

  const filtered = currentList.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    if (tab === "technex") {
      return (
        item.teamName.toLowerCase().includes(s) ||
        item.projectTitle.toLowerCase().includes(s) ||
        item.leaderName.toLowerCase().includes(s) ||
        item.leaderEmail.toLowerCase().includes(s) ||
        item.leaderPrn.toLowerCase().includes(s) ||
        (item.registrationCode && item.registrationCode.toLowerCase().includes(s)) ||
        (item.transactionId && item.transactionId.toLowerCase().includes(s))
      );
    } else {
      return (
        item.fullName.toLowerCase().includes(s) ||
        item.email.toLowerCase().includes(s) ||
        item.prn.toLowerCase().includes(s) ||
        item.department.toLowerCase().includes(s) ||
        (item.transactionId && item.transactionId.toLowerCase().includes(s))
      );
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-brand-white">Registrations & Verification</h1>
        <p className="text-xs text-brand-muted">
          Review payment proofs, inspect student credentials, and manage team approvals.
        </p>
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

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background-card border border-brand-border">
            <span className="text-[10px] font-bold text-brand-muted uppercase px-2">Status:</span>
            {["All", "Pending", "Approved", "Rejected"].map((st) => (
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

          {/* Payment Status Filter (Exclusive to TECHNEX) */}
          {tab === "technex" && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background-card border border-brand-orange/30">
              <span className="text-[10px] font-bold text-brand-orange uppercase px-2 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Payment:
              </span>
              {[
                { label: "All", value: "All" },
                { label: "Pending", value: "Pending Verification" },
                { label: "Verified", value: "Verified" },
                { label: "Rejected", value: "Rejected" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPaymentFilter(p.value)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    paymentFilter === p.value
                      ? "bg-brand-orange/20 text-brand-yellow border border-brand-orange/40 font-bold"
                      : "text-brand-muted hover:text-brand-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={tab === "technex" ? "Search team, leader, PRN, UTR..." : "Search name, PRN, UTR..."}
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
                <th className="px-5 py-3.5">Code / Team</th>
                <th className="px-4 py-3.5">Project Title</th>
                <th className="px-4 py-3.5">Track</th>
                <th className="px-4 py-3.5">Leader Coordinates</th>
                <th className="px-4 py-3.5">Membership / Fee</th>
                <th className="px-4 py-3.5">Payment Verification</th>
                <th className="px-4 py-3.5">UTR Reference</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-background-elevated/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-brand-yellow font-bold block">
                      {item.registrationCode || "PENDING"}
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
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-background-elevated text-brand-yellow border border-brand-orange/40">
                      {item.membershipType || "S4DS Member"}
                    </span>
                    <div className="font-black text-brand-white text-xs mt-0.5">
                      ₹{item.registrationFee ?? 49}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        item.paymentStatus === "Verified"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : item.paymentStatus === "Rejected"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-amber-500/20 text-brand-yellow border border-amber-500/40"
                      }`}
                    >
                      {item.paymentStatus === "Verified" ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : item.paymentStatus === "Rejected" ? (
                        <XCircle className="w-3 h-3 text-rose-400" />
                      ) : (
                        <Clock className="w-3 h-3 text-brand-yellow" />
                      )}
                      {item.paymentStatus || "Pending Verification"}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-brand-secondary">
                    {item.transactionId || "N/A"}
                  </td>
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
                      title="Inspect Team & Verify Payment"
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
            <div className="p-4 rounded-xl bg-background-elevated border border-brand-border flex items-center justify-between">
              <span className="text-xs text-brand-secondary">Current Status:</span>
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

            {/* Content Details */}
            {tab === "technex" ? (
              <div className="space-y-4 text-xs">
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
                    <span className="font-bold text-brand-white block">Additional Members:</span>
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
              <div className="p-4 rounded-xl bg-background-elevated border border-brand-border space-y-3 text-xs text-brand-secondary">
                <div className="grid grid-cols-2 gap-3">
                  <div>Full Name: <span className="font-bold text-brand-white">{selectedRecord.fullName}</span></div>
                  <div>PRN: <span className="font-mono font-bold text-brand-white">{selectedRecord.prn}</span></div>
                  <div>Email: {selectedRecord.email}</div>
                  <div>Phone: {selectedRecord.phone}</div>
                  <div>Department: {selectedRecord.department}</div>
                  <div>Academic Year: {selectedRecord.academicYear}</div>
                  <div>Plan: {selectedRecord.membershipPlan}</div>
                </div>
              </div>
            )}

            {/* Payment Proof & Verification View */}
            <div className="p-5 rounded-2xl bg-background-elevated border-2 border-brand-orange/30 space-y-4 text-xs shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                <span className="font-bold text-brand-white flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-brand-orange" /> Payment &amp; UTR Verification
                </span>
                {tab === "technex" && (
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                      selectedRecord.paymentStatus === "Verified"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : selectedRecord.paymentStatus === "Rejected"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-amber-500/20 text-brand-yellow border border-amber-500/40"
                    }`}
                  >
                    {selectedRecord.paymentStatus === "Verified" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : selectedRecord.paymentStatus === "Rejected" ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-brand-yellow" />
                    )}
                    {selectedRecord.paymentStatus || "Pending Verification"}
                  </span>
                )}
              </div>

              {tab === "technex" && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-background-card border border-brand-border text-brand-secondary">
                  <div>
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Category:</span>
                    <span className="text-brand-orange font-bold text-xs">{selectedRecord.membershipType || "S4DS Member"}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Verified Amount:</span>
                    <span className="text-brand-yellow font-black text-sm font-mono">₹{selectedRecord.registrationFee ?? 49}</span>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-background-card border border-brand-border space-y-1">
                <span className="text-brand-muted block text-[10px] uppercase font-bold">
                  UPI Transaction ID / UTR:
                </span>
                <span className="font-mono text-brand-yellow font-black text-sm tracking-wide block">
                  {selectedRecord.transactionId || "N/A"}
                </span>
              </div>

              {/* Payment Receipt Image Preview */}
              <div className="space-y-2">
                <span className="text-brand-muted block text-[10px] uppercase font-bold">
                  Uploaded Payment Proof:
                </span>
                {selectedRecord.paymentProofUrl ? (
                  <div className="space-y-2">
                    <div className="relative max-h-60 rounded-xl overflow-hidden border border-brand-border bg-black/50 flex items-center justify-center p-2">
                      <img
                        src={selectedRecord.paymentProofUrl}
                        alt="Payment Screenshot Receipt"
                        className="max-h-56 max-w-full object-contain rounded-lg shadow-md"
                      />
                    </div>
                    <div className="flex justify-end">
                      <a
                        href={selectedRecord.paymentProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange/20 text-brand-yellow text-xs font-semibold hover:bg-brand-orange/30 transition-colors border border-brand-orange/30"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Open Full Resolution Receipt
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-background-card border border-brand-border text-center text-brand-muted italic">
                    No receipt image attached to this record
                  </div>
                )}
              </div>

              {/* Admin Direct Action for TECHNEX Payment */}
              {tab === "technex" && (
                <div className="pt-3 border-t border-brand-border space-y-2">
                  <span className="text-[11px] font-bold text-brand-white block uppercase tracking-wider">
                    Update Payment Status:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePaymentVerification(selectedRecord.id, "Verified")}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve &amp; Verify Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePaymentVerification(selectedRecord.id, "Rejected")}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePaymentVerification(selectedRecord.id, "Pending Verification")}
                      className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" /> Mark Pending
                    </button>
                  </div>
                </div>
              )}
            </div>

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
