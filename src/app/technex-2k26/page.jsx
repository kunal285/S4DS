"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Award,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Users,
  ExternalLink,
  CreditCard,
  Copy,
  Upload,
} from "lucide-react";
import Toast from "@/components/Toast";

function WhatsAppIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.676.15-.2.301-.776.978-.952 1.179-.175.2-.351.225-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.676-1.63-.927-2.232-.244-.587-.492-.507-.676-.516l-.576-.01c-.2 0-.526.075-.802.376s-1.053 1.028-1.053 2.508c0 1.48 1.078 2.909 1.229 3.109.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.03-1.429.251-.702.251-1.303.176-1.429-.076-.125-.276-.2-.577-.35z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.05 21.95a.5.5 0 0 0 .61.61l4.83-1.385A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.17 8.17 0 0 1-4.223-1.168.5.5 0 0 0-.411-.047l-3.376.968.974-3.356a.5.5 0 0 0-.05-.418A8.17 8.17 0 0 1 3.8 12c0-4.529 3.671-8.2 8.2-8.2 4.529 0 8.2 3.671 8.2 8.2 0 4.529-3.671 8.2-8.2 8.2z"
      />
    </svg>
  );
}

export default function TechnexPage() {
  const [formData, setFormData] = useState({
    membershipType: "S4DS Member",
    registrationFee: 49,
    teamName: "",
    projectTitle: "",
    domain: "Artificial Intelligence & ML",
    abstractSummary: "",
    githubOrDriveUrl: "",
    leaderName: "",
    leaderEmail: "",
    leaderPhone: "",
    leaderCollege: "MIT Academy of Engineering, Pune",
    leaderPrn: "",
    teamMembers: [],
    utr: "",
  });

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("/images/payment-qr.png");
  const [qrLoading, setQrLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState(null);

  const domains = [
    "Artificial Intelligence & ML",
    "Data Science & Predictive Analytics",
    "Web3 & Decentralized Apps",
    "IoT, Robotics & Embedded Systems",
    "Cloud Architecture & DevOps",
    "Open Track: Interdisciplinary Innovation",
  ];

  useEffect(() => {
    fetchActiveQr();
  }, []);

  const fetchActiveQr = async () => {
    try {
      const res = await fetch("/api/media/active?category=payment-qr");
      const json = await res.json();
      if (json.success && json.data?.fileUrl) {
        setQrCodeUrl(json.data.fileUrl);
      }
    } catch (err) {
      console.warn("Using default QR fallback:", err);
    } finally {
      setQrLoading(false);
    }
  };

  const handleMembershipChange = (category) => {
    const fee = category === "S4DS Member" ? 49 : 99;
    setFormData((prev) => ({
      ...prev,
      membershipType: category,
      registrationFee: fee,
    }));
  };

  const addMember = () => {
    if (formData.teamMembers.length >= 3) {
      setToast({ type: "info", message: "Maximum team size is 4 members (Leader + 3 members)." });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        { name: "", email: "", phone: "", college: prev.leaderCollege, prn: "" },
      ],
    }));
  };

  const removeMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const updateMember = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.teamMembers];
      updated[index][field] = value;
      return { ...prev, teamMembers: updated };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setErrorMessage("Please select a valid image file (PNG, JPG, or JPEG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Screenshot file size must be less than 10MB.");
      return;
    }

    setErrorMessage("");
    setScreenshotFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setScreenshotFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    // 1. Validate Membership
    if (!formData.membershipType || !["S4DS Member", "Non-S4DS Member"].includes(formData.membershipType)) {
      setErrorMessage("Please select a valid Membership Category (S4DS Member or Non-S4DS Member).");
      setSubmitting(false);
      return;
    }

    // 2. Validate Team Details
    if (!formData.teamName || formData.teamName.trim().length < 2) {
      setErrorMessage("Please enter a valid Team Name.");
      setSubmitting(false);
      return;
    }
    if (!formData.projectTitle || formData.projectTitle.trim().length < 3) {
      setErrorMessage("Please enter a descriptive Project Title.");
      setSubmitting(false);
      return;
    }
    if (!formData.leaderName) {
      setErrorMessage("Team Leader Name is required.");
      setSubmitting(false);
      return;
    }
    if (!formData.leaderEmail || !formData.leaderEmail.includes("@")) {
      setErrorMessage("Valid Team Leader email address is required.");
      setSubmitting(false);
      return;
    }
    if (!formData.leaderPhone || formData.leaderPhone.length < 10) {
      setErrorMessage("Valid 10-digit Leader contact number is required.");
      setSubmitting(false);
      return;
    }
    if (!formData.leaderPrn) {
      setErrorMessage("Leader PRN / Roll Number is required.");
      setSubmitting(false);
      return;
    }

    // 3. Validate Payment Fields
    if (!formData.utr || formData.utr.trim().length < 4) {
      setErrorMessage("Please enter a valid UPI Transaction ID / UTR.");
      setSubmitting(false);
      return;
    }
    if (!screenshotFile) {
      setErrorMessage("Please upload your payment screenshot before submitting.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append("membershipType", formData.membershipType);
      payload.append("registrationFee", String(formData.registrationFee));
      payload.append("teamName", formData.teamName.trim());
      payload.append("projectTitle", formData.projectTitle.trim());
      payload.append("domain", formData.domain.trim());
      payload.append("abstractSummary", (formData.abstractSummary || "").trim());
      payload.append("githubOrDriveUrl", (formData.githubOrDriveUrl || "").trim());
      payload.append("leaderName", formData.leaderName.trim());
      payload.append("leaderEmail", formData.leaderEmail.trim());
      payload.append("leaderPhone", formData.leaderPhone.trim());
      payload.append("leaderCollege", formData.leaderCollege.trim());
      payload.append("leaderPrn", formData.leaderPrn.trim());
      payload.append("teamMembers", JSON.stringify(formData.teamMembers));
      payload.append("utr", formData.utr.trim());
      payload.append("screenshot", screenshotFile);

      const res = await fetch("/api/technex", {
        method: "POST",
        body: payload,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const regId = json.data?.id;
        const token = json.data?.confirmationToken || "";
        setToast({ type: "success", message: "TECHNEX 2K26 Registration Successful! Redirecting..." });
        window.location.href = `/registration/success?id=${encodeURIComponent(regId)}&token=${encodeURIComponent(token)}`;
        return;
      } else {
        setErrorMessage(json.error || "Failed to submit registration. Please verify details.");
      }
    } catch (err) {
      setErrorMessage("Network error during submission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* ── Banner Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-xs font-bold text-brand-orange uppercase tracking-wider">
            <Flame className="w-4 h-4 text-brand-yellow" /> Flagship Annual Project Expo
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-brand-white tracking-tight leading-tight">
            TECHNEX <span className="brand-text-gradient">2K26</span>
          </h1>

          <p className="text-base sm:text-lg text-brand-secondary leading-relaxed">
            The marquee project innovation exhibition hosted by the Society for Data Science (S4DS) Student Chapter, MIT Academy of Engineering, Alandi, Pune. Present your breakthrough engineering solutions, AI/ML pipelines, and full-stack software architectures to industry juries.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-background-card border border-brand-border space-y-1">
              <Calendar className="w-5 h-5 text-brand-orange" />
              <div className="text-xs text-brand-muted">Date</div>
              <div className="text-sm font-bold text-brand-white">Nov 21, 2026</div>
            </div>
            <div className="p-4 rounded-2xl bg-background-card border border-brand-border space-y-1">
              <MapPin className="w-5 h-5 text-brand-orange" />
              <div className="text-xs text-brand-muted">Venue</div>
              <div className="text-sm font-bold text-brand-white">MITAOE Campus</div>
            </div>
            <div className="p-4 rounded-2xl bg-background-card border border-brand-border space-y-1 col-span-2 sm:col-span-1">
              <Clock className="w-5 h-5 text-brand-orange" />
              <div className="text-xs text-brand-muted">Format</div>
              <div className="text-sm font-bold text-brand-white">Offline Project Expo</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden border-2 border-brand-orange/30 shadow-2xl shadow-brand-red/20 bg-background-card">
            <Image
              src="/images/technex-poster.png"
              alt="TECHNEX 2K26 Official Expo Poster"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* ── Domains Strip ── */}
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-brand-white">
          Competition Tracks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((d, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-background-card border border-brand-border hover:border-brand-border-hover transition-all flex items-center gap-3 shadow-md"
            >
              <div className="w-8 h-8 rounded-lg bg-background-elevated border border-brand-border flex items-center justify-center text-brand-orange text-xs font-bold shrink-0">
                0{idx + 1}
              </div>
              <span className="text-sm font-bold text-brand-secondary">{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Official WhatsApp Group Banner ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#17110D] via-[#1b251d] to-[#121c14] border-2 border-[#25D366]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#25D366]">
              <WhatsAppIcon className="w-4 h-4" /> Official Event Channel
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Join the Official TECHNEX 2K26 WhatsApp Group
            </h3>
            <p className="text-xs sm:text-sm text-[#FFF1DF]/90 max-w-xl leading-relaxed">
              Connect with fellow participants, receive official problem statement releases, expo hall room allocations, and live schedule updates.
            </p>
          </div>
          <a
            href="https://chat.whatsapp.com/KFYW22NYGasBag1RZjnKJl"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-7 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-[#25D366]/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            JOIN WHATSAPP GROUP
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ── Registration Form ── */}
      <div className="pt-8 border-t border-brand-border">
        <form
          onSubmit={handleSubmit}
          className="p-8 sm:p-12 rounded-3xl bg-background-card border border-brand-border space-y-8 shadow-xl"
        >
          <div className="border-b border-brand-border pb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-white">
              Team Registration Portal
            </h2>
            <p className="text-sm text-brand-muted mt-1">
              Teams can consist of 1 to 4 members. Complete your team information, submit payment details, and register directly below.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-[#2d1210]/95 border border-rose-500/50 text-rose-200 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ── SECTION 1: Membership Category Selection (Mandatory & Dynamic) ── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-yellow" /> 1. Membership Category *
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-brand-muted">Active Fee:</span>
                <span className="px-2.5 py-1 rounded-lg bg-brand-orange/20 text-brand-yellow font-extrabold border border-brand-orange/40 text-sm font-mono">
                  ₹{formData.registrationFee} / Team
                </span>
              </div>
            </div>

            <p className="text-xs text-brand-secondary">
              Select your team&apos;s membership classification. S4DS MITAOE Student Chapter members receive a special discounted registration fee of ₹49.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Option 1: S4DS Member */}
              <div
                onClick={() => handleMembershipChange("S4DS Member")}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all border ${
                  formData.membershipType === "S4DS Member"
                    ? "border-brand-orange bg-gradient-to-br from-[#EC3507]/20 via-[#FC8706]/15 to-[#302016] ring-2 ring-brand-orange shadow-xl shadow-brand-red/10"
                    : "border-brand-border bg-background-elevated hover:border-brand-orange/50 hover:bg-background-secondary"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-brand-white">
                        S4DS Member Team
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Discounted
                      </span>
                    </div>
                    <p className="text-xs text-brand-secondary leading-relaxed">
                      At least one team member holds an active S4DS MITAOE Student Chapter membership.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black font-mono text-brand-yellow">₹49</span>
                    <span className="text-[10px] text-brand-muted block">per team</span>
                  </div>
                </div>
              </div>

              {/* Option 2: Non-S4DS Member */}
              <div
                onClick={() => handleMembershipChange("Non-S4DS Member")}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all border ${
                  formData.membershipType === "Non-S4DS Member"
                    ? "border-brand-orange bg-gradient-to-br from-[#EC3507]/20 via-[#FC8706]/15 to-[#302016] ring-2 ring-brand-orange shadow-xl shadow-brand-red/10"
                    : "border-brand-border bg-background-elevated hover:border-brand-orange/50 hover:bg-background-secondary"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-brand-white">
                        Non-S4DS Member Team
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-brand-orange/20 text-brand-yellow border border-brand-orange/40">
                        General
                      </span>
                    </div>
                    <p className="text-xs text-brand-secondary leading-relaxed">
                      Open to all students from MITAOE and other accredited institutions across Maharashtra.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black font-mono text-brand-white">₹99</span>
                    <span className="text-[10px] text-brand-muted block">per team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 2: Team & Project Details ── */}
          <div className="space-y-4 pt-4 border-t border-brand-border">
            <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-yellow" /> 2. Team &amp; Project Coordinates *
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NeuralCoders"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Project Domain / Track *
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                >
                  {domains.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Traffic Flow Optimization using Vision Transformers"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Project Abstract / Brief Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe your problem statement, technical stack, architecture, and expected impact (100-250 words)..."
                  value={formData.abstractSummary}
                  onChange={(e) => setFormData({ ...formData, abstractSummary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  GitHub Repository / Google Drive Demo Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project or drive link"
                  value={formData.githubOrDriveUrl}
                  onChange={(e) => setFormData({ ...formData, githubOrDriveUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 3: Team Leader Details ── */}
          <div className="space-y-4 pt-4 border-t border-brand-border">
            <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-yellow" /> 3. Team Leader Details *
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Leader Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.leaderName}
                  onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Leader Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="aarav@mitaoe.ac.in"
                  value={formData.leaderEmail}
                  onChange={(e) => setFormData({ ...formData, leaderEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Leader WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.leaderPhone}
                  onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  College / Institute Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="MIT Academy of Engineering, Pune"
                  value={formData.leaderCollege}
                  onChange={(e) => setFormData({ ...formData, leaderCollege: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Leader PRN / Roll Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2022BTECS001"
                  value={formData.leaderPrn}
                  onChange={(e) => setFormData({ ...formData, leaderPrn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 4: Team Members (Up to 3 Additional Members) ── */}
          <div className="space-y-4 pt-4 border-t border-brand-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-yellow" /> 4. Additional Team Members (Optional)
                </h3>
                <p className="text-xs text-brand-secondary mt-0.5">
                  Teams can include 1 to 4 members total. You have added {formData.teamMembers.length} additional member(s).
                </p>
              </div>

              {formData.teamMembers.length < 3 && (
                <button
                  type="button"
                  onClick={addMember}
                  className="px-3 py-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary border border-brand-border text-brand-white hover:text-brand-orange text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Member
                </button>
              )}
            </div>

            {formData.teamMembers.length > 0 && (
              <div className="space-y-3">
                {formData.teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-background-elevated border border-brand-border space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-white">
                        Member #{idx + 2}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Member Full Name"
                        value={member.name}
                        onChange={(e) => updateMember(idx, "name", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-background-card border border-brand-border text-brand-white text-xs"
                      />
                      <input
                        type="email"
                        placeholder="Member Email"
                        value={member.email}
                        onChange={(e) => updateMember(idx, "email", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-background-card border border-brand-border text-brand-white text-xs"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={member.phone}
                        onChange={(e) => updateMember(idx, "phone", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-background-card border border-brand-border text-brand-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="PRN / Roll Number"
                        value={member.prn}
                        onChange={(e) => updateMember(idx, "prn", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-background-card border border-brand-border text-brand-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── SECTION 5: Online Payment Details & Proof Upload ── */}
          <div className="pt-8 border-t border-brand-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-yellow" /> 5. Payment Details &amp; Proof of Transaction *
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-brand-muted">Amount Payable:</span>
                <span className="px-3 py-1 rounded-xl bg-brand-orange/20 text-brand-yellow font-extrabold border border-brand-orange/40 text-sm font-mono">
                  ₹{formData.registrationFee}
                </span>
              </div>
            </div>

            <p className="text-xs text-brand-secondary">
              Scan the official S4DS MITAOE chapter QR code below or transfer directly to our UPI ID. After completing your payment, enter your UPI Transaction ID (UTR) and upload the payment screenshot.
            </p>

            {/* QR Code & Instructions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-background-elevated border border-brand-orange/30 shadow-lg">
              {/* QR Image Box */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#17110D] border border-brand-border space-y-3">
                <div className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-brand-orange/40 bg-white p-2 shadow-inner">
                  {qrLoading ? (
                    <div className="w-full h-full flex items-center justify-center text-xs text-brand-muted">
                      Loading QR...
                    </div>
                  ) : (
                    <Image
                      src={qrCodeUrl}
                      alt="TECHNEX 2K26 Official Payment QR Code"
                      fill
                      className="object-contain p-1"
                      priority
                    />
                  )}
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider block">
                    Scan to Pay ₹{formData.registrationFee}
                  </span>
                  <span className="text-[10px] text-brand-muted block">
                    Accepts Google Pay, PhonePe, Paytm &amp; all UPI apps
                  </span>
                </div>
              </div>

              {/* Instructions & UPI Details */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                    <span className="text-xs font-bold text-brand-white">Official Chapter UPI ID:</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("9172106568@airtel");
                        setToast({ type: "success", message: "UPI ID copied to clipboard!" });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-background-card hover:bg-[#302016] text-brand-orange hover:text-brand-yellow border border-brand-border text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" /> 9172106568@airtel
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-brand-secondary">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand-orange/20 text-brand-orange text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span>Scan the official QR code using Google Pay, PhonePe, Paytm, or BHIM.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand-orange/20 text-brand-orange text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span>Pay the exact fee of <strong className="text-brand-yellow font-mono">₹{formData.registrationFee}</strong> for your team (<span className="text-brand-white font-semibold">{formData.membershipType}</span>).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand-orange/20 text-brand-orange text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span>Note down your 12-digit UPI Reference Number / UTR.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand-orange/20 text-brand-orange text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                      <span>Capture a clear screenshot of the transaction receipt and upload it below.</span>
                    </div>
                  </div>
                </div>

                {/* Amount Highlight */}
                <div className="p-3 rounded-xl bg-[#17110D] border border-brand-orange/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-muted block">Payable Amount</span>
                    <span className="text-xs text-brand-white font-semibold">{formData.membershipType}</span>
                  </div>
                  <span className="text-2xl font-black font-mono text-brand-yellow">₹{formData.registrationFee}</span>
                </div>
              </div>
            </div>

            {/* Input Field A: UPI Transaction ID / UTR */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#FFF1DF] flex items-center justify-between">
                <span>A. UPI Transaction ID / UTR *</span>
                <span className="text-[10px] text-brand-muted normal-case font-normal">Found in your payment app receipt</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 431289567123 or UPI Ref No."
                value={formData.utr}
                onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#17110D] border border-[rgba(252,135,6,0.25)] text-white placeholder-[#B8A99A] text-sm focus:outline-none focus:border-[#FC8706] focus:ring-1 focus:ring-[rgba(252,135,6,0.20)] font-mono"
              />
            </div>

            {/* Input Field B: Payment Screenshot Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#FFF1DF] flex items-center justify-between">
                <span>B. Payment Screenshot Proof *</span>
                <span className="text-[10px] text-brand-muted normal-case font-normal">PNG, JPG or JPEG (Max 10MB)</span>
              </label>

              {!previewUrl ? (
                <label className="flex flex-col items-center justify-center w-full h-36 px-4 transition-all bg-[#17110D] border-2 border-dashed border-[rgba(252,135,6,0.30)] hover:border-[#FC8706] rounded-2xl cursor-pointer group hover:bg-[#201610]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/15 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-brand-yellow" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-white group-hover:text-brand-yellow transition-colors block">
                        Click or drag to upload payment screenshot
                      </span>
                      <span className="text-[10px] text-[#B8A99A] block mt-0.5">
                        Accepts PNG, JPG or JPEG up to 10MB
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="p-4 rounded-2xl bg-[#17110D] border border-[#25D366]/40 flex items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-brand-border bg-black/40 shrink-0">
                      <Image
                        src={previewUrl}
                        alt="Payment screenshot preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-white truncate block flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {screenshotFile?.name || "Payment Screenshot"}
                      </span>
                      <span className="text-[10px] text-brand-muted block mt-0.5">
                        {(screenshotFile?.size ? (screenshotFile.size / 1024).toFixed(1) + " KB" : "")} • Ready for direct upload
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className="px-3 py-1.5 rounded-lg bg-background-elevated hover:bg-[#302016] text-xs font-semibold text-brand-secondary hover:text-white border border-brand-border cursor-pointer transition-colors">
                      Change
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors"
                      title="Remove selected file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Registration Fee Summary Card */}
            <div className="p-6 rounded-2xl bg-background-elevated border border-brand-orange/30 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                  Registration Summary
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-orange/20 text-brand-yellow border border-brand-orange/30">
                  {formData.membershipType}
                </span>
              </div>
              <div className="space-y-2 text-xs text-brand-secondary">
                <div className="flex justify-between items-center">
                  <span>Selected Category:</span>
                  <span className="font-semibold text-brand-white">
                    {formData.membershipType === "S4DS Member" ? "S4DS Student Chapter Member" : "Non-S4DS General Participant"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Team Size:</span>
                  <span className="font-semibold text-brand-white">
                    1 Leader + {formData.teamMembers.length} Members ({1 + formData.teamMembers.length} Total)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-brand-border text-sm font-bold text-brand-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-brand-yellow text-3xl font-black font-mono">
                    ₹{formData.registrationFee}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl brand-btn text-white font-extrabold text-base transition-transform hover:scale-[1.01] shadow-xl shadow-brand-red/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? "Submitting Registration..." : "SUBMIT REGISTRATION"}
          </button>
        </form>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
