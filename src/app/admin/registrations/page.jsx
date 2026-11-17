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
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  Trash2,
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
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toast, setToast] = useState(null);

  // Full-screen Interactive Payment Screenshot Viewer Modal State
  const [viewerModal, setViewerModal] = useState({
    open: false,
    url: "",
    teamName: "",
    regCode: "",
    utr: "",
    fee: null,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab, statusFilter, membershipFilter, departmentFilter, yearFilter, sortOrder]);

  // Reset page to 1 whenever search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, membershipFilter, departmentFilter, yearFilter, sortOrder, tab]);

  // ESC key handler to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (viewerModal.open) {
          closeViewer();
        } else if (selectedRecord) {
          setSelectedRecord(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerModal.open, selectedRecord]);

  const fetchData = async () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("s4ds_admin_token") : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (tab === "technex") {
        if (membershipFilter !== "All") params.append("membershipType", membershipFilter);
        if (departmentFilter !== "All") params.append("department", departmentFilter);
        if (yearFilter !== "All") params.append("academicYear", yearFilter);
        params.append("sortBy", sortOrder);
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
    const token = typeof window !== "undefined" ? localStorage.getItem("s4ds_admin_token") : null;
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
        if (selectedRecord && (selectedRecord.id === id || selectedRecord.registrationCode === id)) {
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

  const handleDelete = async (id, title) => {
    if (!id) return;
    const itemTitle = title || id;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete registration "${itemTitle}"? This will remove it from the database and cannot be undone.`
      )
    ) {
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("s4ds_admin_token") : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const url = tab === "technex" ? `/api/technex/${id}` : `/api/membership/${id}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", message: `Registration "${itemTitle}" deleted successfully.` });
        if (selectedRecord && (selectedRecord.id === id || selectedRecord.registrationCode === id)) {
          setSelectedRecord(null);
        }
        fetchData();
      } else {
        setToast({ type: "error", message: data.error || "Failed to delete registration" });
      }
    } catch {
      setToast({ type: "error", message: "Network error deleting registration" });
    }
  };

  // Open the interactive full-screen screenshot viewer
  const openViewer = (item) => {
    if (!item?.paymentScreenshotUrl) return;
    setZoomLevel(1);
    setImageLoading(true);
    setImageError(false);
    setViewerModal({
      open: true,
      url: item.paymentScreenshotUrl,
      teamName: item.teamName || item.fullName || "Student",
      regCode: item.registrationCode || item.registrationId || item.id || "",
      utr: item.utr || item.upiTransactionId || item.transactionId || "",
      fee: item.registrationFee ?? (item.membershipType === "S4DS Member" ? 49 : 99),
    });
  };

  const closeViewer = () => {
    setViewerModal({ open: false, url: "", teamName: "", regCode: "", utr: "", fee: null });
    setZoomLevel(1);
    setImageLoading(true);
    setImageError(false);
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(3, +(prev + 0.25).toFixed(2)));
  const zoomOut = () => setZoomLevel((prev) => Math.max(0.5, +(prev - 0.25).toFixed(2)));
  const resetZoom = () => setZoomLevel(1);

  const currentList = tab === "technex" ? technexList : membershipList;

  const filtered = currentList.filter((item) => {
    if (tab === "technex") {
      if (membershipFilter !== "All" && item.membershipType !== membershipFilter) return false;
      if (departmentFilter !== "All") {
        const dept = (item.leaderDepartment || "").toLowerCase();
        if (dept !== departmentFilter.toLowerCase()) return false;
      }
      if (yearFilter !== "All") {
        const yr = (item.leaderYear || "").toLowerCase();
        if (yr !== yearFilter.toLowerCase()) return false;
      }
    }

    if (!search) return true;
    const s = search.toLowerCase();
    if (tab === "technex") {
      return (
        item.id?.toLowerCase().includes(s) ||
        item.registrationCode?.toLowerCase().includes(s) ||
        item.registrationId?.toLowerCase().includes(s) ||
        item.teamName?.toLowerCase().includes(s) ||
        item.projectTitle?.toLowerCase().includes(s) ||
        item.leaderName?.toLowerCase().includes(s) ||
        item.leaderEmail?.toLowerCase().includes(s) ||
        item.leaderPrn?.toLowerCase().includes(s) ||
        item.leaderDepartment?.toLowerCase().includes(s) ||
        item.domain?.toLowerCase().includes(s) ||
        (item.utr && item.utr.toLowerCase().includes(s)) ||
        (item.teamMembers || []).some(
          (m) =>
            m.name?.toLowerCase().includes(s) ||
            m.email?.toLowerCase().includes(s) ||
            m.prn?.toLowerCase().includes(s) ||
            m.department?.toLowerCase().includes(s)
        )
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

  // Pagination calculations
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedList = filtered.slice(startIndex, endIndex);

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
        "Leader Department",
        "Leader Academic Year",
        "Leader Division",
        "Team Size",
        "Additional Members",
        "Status",
        "Registration Timestamp",
      ];

      const rows = filtered.map((item) => {
        const addMembers = (item.teamMembers || [])
          .map(
            (m) =>
              `${m.name} (${m.email || ""}${m.prn ? " - " + m.prn : ""}${
                m.department ? " - " + m.department : ""
              }${m.year ? " - " + m.year : ""}${m.division ? " Div " + m.division : ""})`
          )
          .join("; ");

        return [
          `"${item.id || ""}"`,
          `"${item.registrationCode || item.registrationId || ""}"`,
          `"${(item.teamName || "").replace(/"/g, '""')}"`,
          `"${(item.projectTitle || "").replace(/"/g, '""')}"`,
          `"${(item.domain || "").replace(/"/g, '""')}"`,
          `"${item.membershipType || "Non-S4DS Member"}"`,
          item.registrationFee ?? (item.membershipType === "S4DS Member" ? 49 : 99),
          `"${item.utr || item.upiTransactionId || ""}"`,
          `"${item.paymentScreenshotUrl || ""}"`,
          `"${(item.leaderName || "").replace(/"/g, '""')}"`,
          `"${item.leaderEmail || ""}"`,
          `"${item.leaderPhone || ""}"`,
          `"${item.leaderPrn || ""}"`,
          `"${(item.leaderCollege || "").replace(/"/g, '""')}"`,
          `"${(item.leaderDepartment || "").replace(/"/g, '""')}"`,
          `"${(item.leaderYear || "").replace(/"/g, '""')}"`,
          `"${(item.leaderDivision || "").replace(/"/g, '""')}"`,
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
            Inspect team entries, filter by department &amp; membership categories, verify payments, and export to CSV.
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
      <div className="space-y-3">
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

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                tab === "technex"
                  ? "Search by Reg ID, Team, Leader, PRN..."
                  : "Search name, PRN, email..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background-elevated border border-brand-border text-brand-white placeholder-brand-muted focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        {/* Secondary Filters: Department, Year & Date Sort (Exclusive to TECHNEX) */}
        {tab === "technex" && (
          <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-xl bg-background-card/60 border border-brand-border text-xs">
            <span className="text-[10px] font-bold text-brand-muted uppercase flex items-center gap-1">
              <Filter className="w-3 h-3 text-brand-orange" /> Filter By:
            </span>

            {/* Department Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-brand-secondary text-[11px]">Dept:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
              >
                <option value="All">All Departments</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="AI & Data Science">AI &amp; Data Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Telecommunication">Electronics &amp; Telecom</option>
                <option value="Mechanical Engineering">Mechanical</option>
                <option value="Civil Engineering">Civil</option>
                <option value="Chemical Engineering">Chemical</option>
                <option value="Design / Other">Design / Other</option>
              </select>
            </div>

            {/* Year Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-brand-secondary text-[11px]">Year:</span>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange"
              >
                <option value="All">All Years</option>
                <option value="First Year">First Year (FY)</option>
                <option value="Second Year">Second Year (SY)</option>
                <option value="Third Year">Third Year (TY)</option>
                <option value="Final Year">Final Year (B.Tech)</option>
              </select>
            </div>

            {/* Date Sorting */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-brand-secondary text-[11px]">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-background-elevated border border-brand-border text-brand-white text-xs focus:outline-none focus:border-brand-orange font-semibold"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        )}
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
        <div className="space-y-4">
          <div className="w-full bg-background-card border border-brand-border rounded-2xl overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-background-elevated border-b border-brand-border text-brand-secondary uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Registration ID / Team</th>
                  <th className="px-4 py-3.5">Project Title</th>
                  <th className="px-4 py-3.5">Track / Domain</th>
                  <th className="px-4 py-3.5">Leader Coordinates</th>
                  <th className="px-4 py-3.5">Department &amp; Year</th>
                  <th className="px-4 py-3.5">Membership Category</th>
                  <th className="px-4 py-3.5">Fee</th>
                  <th className="px-4 py-3.5">UPI / UTR</th>
                  <th className="px-4 py-3.5">Payment Screenshot</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {paginatedList.map((item) => (
                  <tr key={item.id} className="hover:bg-background-elevated/40 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-brand-yellow font-bold block text-sm">
                        {item.registrationCode || item.registrationId || item.id}
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
                    <td className="px-4 py-4 text-brand-secondary">
                      <div className="font-semibold text-brand-white text-[11px]">
                        {item.leaderDepartment || "N/A"}
                      </div>
                      <div className="text-[10px] text-brand-muted">
                        {item.leaderYear || "Year N/A"}{item.leaderDivision ? ` • Div ${item.leaderDivision}` : ""}
                      </div>
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
                        <button
                          type="button"
                          onClick={() => openViewer(item)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background-elevated hover:bg-[#302016] text-brand-orange hover:text-brand-yellow border border-brand-border text-[10px] font-bold transition-all shadow-sm group"
                          title="Open Full Screenshot Viewer with Zoom"
                        >
                          <Maximize2 className="w-3 h-3 group-hover:scale-110 transition-transform" /> View Proof
                        </button>
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRecord(item)}
                          className="p-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary text-brand-secondary hover:text-brand-white border border-brand-border transition-colors"
                          title="Inspect Team Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id || item.registrationCode, item.teamName || item.registrationCode)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-200 border border-rose-500/30 transition-colors"
                          title="Delete Registration Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs text-brand-muted">
              <div>
                Showing <span className="font-bold text-brand-white">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-brand-white">{endIndex}</span> of{" "}
                <span className="font-bold text-brand-white">{totalItems}</span> registrations
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary disabled:opacity-30 disabled:cursor-not-allowed border border-brand-border text-brand-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                    // Show first, last, and current +/- 1
                    if (pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                      return (
                        <button
                          key={pg}
                          type="button"
                          onClick={() => setCurrentPage(pg)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                            currentPage === pg
                              ? "bg-brand-orange text-white shadow-md shadow-brand-orange/30"
                              : "bg-background-card hover:bg-background-elevated text-brand-muted hover:text-brand-white border border-brand-border"
                          }`}
                        >
                          {pg}
                        </button>
                      );
                    }
                    if (pg === currentPage - 2 || pg === currentPage + 2) {
                      return (
                        <span key={pg} className="px-1 text-brand-muted">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary disabled:opacity-30 disabled:cursor-not-allowed border border-brand-border text-brand-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Membership Applications Table */
        <div className="space-y-4">
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
                {paginatedList.map((item) => (
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRecord(item)}
                          className="p-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary text-brand-secondary hover:text-brand-white border border-brand-border transition-colors"
                          title="Inspect Application"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.fullName || item.email)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-200 border border-rose-500/30 transition-colors"
                          title="Delete Application Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs text-brand-muted">
              <div>
                Showing <span className="font-bold text-brand-white">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-brand-white">{endIndex}</span> of{" "}
                <span className="font-bold text-brand-white">{totalItems}</span> applications
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary disabled:opacity-30 disabled:cursor-not-allowed border border-brand-border text-brand-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentPage(pg)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === pg
                          ? "bg-brand-orange text-white shadow-md shadow-brand-orange/30"
                          : "bg-background-card hover:bg-background-elevated text-brand-muted hover:text-brand-white border border-brand-border"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary disabled:opacity-30 disabled:cursor-not-allowed border border-brand-border text-brand-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
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
                    <span className="text-[10px] text-brand-muted">Recorded in RushDB • Ready for event expo</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 w-fit">
                  {selectedRecord.status || "Approved"}
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
                      {selectedRecord.registrationCode || selectedRecord.registrationId || selectedRecord.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Membership &amp; Fee:</span>
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
                          <button
                            type="button"
                            onClick={() => openViewer(selectedRecord)}
                            className="px-2.5 py-1 rounded bg-[#17110D] hover:bg-[#251710] text-brand-orange hover:text-brand-yellow border border-brand-border text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Maximize2 className="w-3 h-3" /> Full-Screen Viewer
                          </button>
                          <a
                            href={selectedRecord.paymentScreenshotUrl}
                            download={`technex-payment-${selectedRecord.registrationCode || selectedRecord.id}.png`}
                            className="px-2.5 py-1 rounded bg-[#17110D] hover:bg-[#251710] text-brand-secondary hover:text-white border border-brand-border text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3 h-3" /> Download
                          </a>
                        </div>
                      </div>

                      <div
                        onClick={() => openViewer(selectedRecord)}
                        className="relative w-full h-64 rounded-xl overflow-hidden border border-brand-border bg-black/60 cursor-pointer group"
                        title="Click to open interactive full-screen viewer"
                      >
                        <Image
                          src={selectedRecord.paymentScreenshotUrl}
                          alt={`Payment proof for ${selectedRecord.teamName}`}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="px-3 py-1.5 rounded-lg bg-black/80 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20">
                            <Maximize2 className="w-3.5 h-3.5 text-brand-yellow" /> Click to Zoom &amp; Inspect
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-[#17110D] border border-brand-border text-xs text-brand-muted">
                      No payment screenshot attached for this record.
                    </div>
                  )}
                </div>

                {/* Project Details */}
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

                {/* Team Leader Details */}
                <div className="p-4 rounded-xl bg-background-elevated border border-brand-border space-y-3">
                  <span className="font-bold text-brand-white block flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-yellow" /> Team Leader Details:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-brand-secondary">
                    <div><span className="text-brand-muted text-[10px] block uppercase">Name:</span> <span className="text-white font-semibold">{selectedRecord.leaderName}</span></div>
                    <div><span className="text-brand-muted text-[10px] block uppercase">Email:</span> <span className="text-white">{selectedRecord.leaderEmail}</span></div>
                    <div><span className="text-brand-muted text-[10px] block uppercase">Phone:</span> <span className="text-white">{selectedRecord.leaderPhone}</span></div>
                    <div><span className="text-brand-muted text-[10px] block uppercase">PRN:</span> <span className="font-mono text-brand-yellow font-bold">{selectedRecord.leaderPrn}</span></div>
                    <div><span className="text-brand-muted text-[10px] block uppercase">Department:</span> <span className="text-white">{selectedRecord.leaderDepartment || "N/A"}</span></div>
                    <div><span className="text-brand-muted text-[10px] block uppercase">Academic Year:</span> <span className="text-white">{selectedRecord.leaderYear || "N/A"}{selectedRecord.leaderDivision ? ` (Div ${selectedRecord.leaderDivision})` : ""}</span></div>
                    <div className="col-span-2"><span className="text-brand-muted text-[10px] block uppercase">College:</span> <span className="text-white">{selectedRecord.leaderCollege}</span></div>
                  </div>
                </div>

                {/* Additional Team Members */}
                {selectedRecord.teamMembers?.length > 0 && (
                  <div className="p-4 rounded-xl bg-background-elevated border border-brand-border space-y-3">
                    <span className="font-bold text-brand-white block flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-orange" /> Additional Team Members ({selectedRecord.teamMembers.length}):
                    </span>
                    <div className="space-y-2">
                      {selectedRecord.teamMembers.map((m, i) => (
                        <div key={i} className="p-3 rounded-lg bg-[#17110D] border border-brand-border grid grid-cols-2 gap-2 text-brand-secondary">
                          <div>
                            <span className="text-[10px] uppercase text-brand-muted block">Member #{i + 2}:</span>
                            <span className="font-bold text-white">{m.name}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-brand-muted block">PRN:</span>
                            <span className="font-mono text-brand-yellow font-semibold">{m.prn || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-brand-muted block">Email:</span>
                            <span>{m.email || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-brand-muted block">Phone:</span>
                            <span>{m.phone || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-brand-muted block">Department:</span>
                            <span>{m.department || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-brand-muted block">Year &amp; Division:</span>
                            <span>{m.year || "N/A"}{m.division ? ` (Div ${m.division})` : ""}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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

            <div className="flex items-center justify-between pt-2 border-t border-brand-border/60">
              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    selectedRecord.id || selectedRecord.registrationCode,
                    tab === "technex"
                      ? selectedRecord.teamName || selectedRecord.registrationCode
                      : selectedRecord.fullName || selectedRecord.email
                  )
                }
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete {tab === "technex" ? "Registration" : "Application"}
              </button>
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

      {/* ─────────────────────────────────────────────────────────────
          FULL-SCREEN INTERACTIVE PAYMENT SCREENSHOT VIEWER MODAL
         ───────────────────────────────────────────────────────────── */}
      {viewerModal.open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in select-none">
          {/* Top Bar with Title, Details & Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/60 bg-[#120D0A]/90 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                <ShieldCheck className="w-5 h-5 text-brand-yellow" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{viewerModal.teamName}</span>
                  {viewerModal.regCode && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-brand-orange/20 text-brand-yellow border border-brand-orange/40">
                      {viewerModal.regCode}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-brand-muted">
                  UTR: <span className="font-mono text-brand-secondary font-bold">{viewerModal.utr || "N/A"}</span>
                  {viewerModal.fee ? ` • Fee: ₹${viewerModal.fee}` : ""}
                </p>
              </div>
            </div>

            {/* Interactive Zoom & Download Controls */}
            <div className="flex items-center gap-2">
              {/* Zoom Out Button */}
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-2 rounded-xl bg-background-card hover:bg-background-elevated disabled:opacity-30 border border-brand-border text-brand-secondary hover:text-white transition-colors"
                title="Zoom Out (-25%)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Zoom Percentage Indicator */}
              <button
                type="button"
                onClick={resetZoom}
                className="px-3 py-1.5 rounded-xl bg-background-card hover:bg-background-elevated border border-brand-border text-xs font-mono font-bold text-brand-yellow transition-colors"
                title="Reset Zoom to 100%"
              >
                {Math.round(zoomLevel * 100)}%
              </button>

              {/* Zoom In Button */}
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                className="p-2 rounded-xl bg-background-card hover:bg-background-elevated disabled:opacity-30 border border-brand-border text-brand-secondary hover:text-white transition-colors"
                title="Zoom In (+25%)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={resetZoom}
                className="p-2 rounded-xl bg-background-card hover:bg-background-elevated border border-brand-border text-brand-secondary hover:text-white transition-colors"
                title="Reset Zoom (1:1)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Download Original Screenshot Button */}
              <a
                href={viewerModal.url}
                download={`payment-proof-${viewerModal.regCode || "technex"}.png`}
                className="px-3.5 py-1.5 rounded-xl bg-brand-orange/20 hover:bg-brand-orange/30 border border-brand-orange/40 text-brand-yellow text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ml-2"
                title="Download original payment screenshot"
              >
                <Download className="w-4 h-4" /> Download Original
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeViewer}
                className="p-2 rounded-xl bg-background-card hover:bg-rose-500/20 text-brand-muted hover:text-rose-300 border border-brand-border transition-colors ml-2"
                title="Close Viewer (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Canvas / Viewport Area */}
          <div className="relative flex-1 overflow-auto flex items-center justify-center p-6 bg-dot-pattern">
            {imageLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-black/60 z-10">
                <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-brand-muted font-medium">Loading high-resolution payment screenshot...</span>
              </div>
            )}

            {imageError ? (
              <div className="p-8 rounded-2xl bg-background-secondary border border-rose-500/40 text-center space-y-3 max-w-md">
                <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Failed to load screenshot</h4>
                <p className="text-xs text-brand-muted">
                  The signed URL might have expired or the media resource is currently unreachable.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <a
                    href={viewerModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                  </a>
                  <button
                    type="button"
                    onClick={closeViewer}
                    className="px-4 py-2 rounded-xl bg-background-card border border-brand-border text-xs text-brand-muted"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="transition-transform duration-200 ease-out origin-center flex items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel})`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={viewerModal.url}
                  alt={`Payment proof for ${viewerModal.teamName}`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                  className="max-w-[85vw] max-h-[75vh] object-contain rounded-xl shadow-2xl border border-brand-border/40 bg-black/40"
                />
              </div>
            )}
          </div>

          {/* Bottom Toolbar Hint */}
          <div className="px-6 py-2.5 border-t border-brand-border/40 bg-[#120D0A]/70 flex items-center justify-between text-[11px] text-brand-muted shrink-0">
            <span>Use + / - buttons to zoom into UPI transaction reference or timestamp.</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-background-elevated border border-brand-border font-mono text-[10px]">ESC</kbd> to exit full-screen</span>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
