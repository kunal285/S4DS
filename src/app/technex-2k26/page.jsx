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

let clientTechnexCache = null;
let clientTechnexTime = 0;

export default function TechnexPage() {
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

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
    leaderDepartment: "Computer Engineering",
    leaderYear: "Third Year",
    leaderDivision: "A",
    teamMembers: [],
    utr: "",
  });

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState(null);

  const applyConfig = (cfg) => {
    setConfig(cfg);
    const tiers = cfg.membershipTiers || [];
    const initialTier = tiers[0] || { name: "S4DS Member", fee: 49 };
    const initialDomain = cfg.domains?.[0] || "Artificial Intelligence & ML";

    setFormData((prev) => ({
      ...prev,
      membershipType: prev.membershipType || initialTier.name,
      registrationFee: prev.registrationFee || initialTier.fee,
      domain: prev.domain || initialDomain,
    }));

    if (cfg.activePaymentQrUrl) {
      setQrCodeUrl(cfg.activePaymentQrUrl);
    }
  };

  useEffect(() => {
    if (clientTechnexCache && Date.now() - clientTechnexTime < 60000) {
      applyConfig(clientTechnexCache);
      setLoadingConfig(false);
      return;
    }
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/technex/config");
      const json = await res.json();
      if (json.success && json.data) {
        const cfg = json.data;
        clientTechnexCache = cfg;
        clientTechnexTime = Date.now();
        applyConfig(cfg);
      }
    } catch (err) {
      console.warn("Notice: Fetching TECHNEX config:", err);
    } finally {
      setLoadingConfig(false);
      setQrLoading(false);
    }
  };

  const handleMembershipChange = (category, fee) => {
    setFormData((prev) => ({
      ...prev,
      membershipType: category,
      registrationFee: fee,
    }));
  };

  const addMember = () => {
    const maxAdditional = (config?.maxTeamSize || 4) - 1;
    if (formData.teamMembers.length >= maxAdditional) {
      setToast({
        type: "info",
        message: `Maximum team size is ${config?.maxTeamSize || 4} members (1 Leader + ${maxAdditional} members).`,
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          name: "",
          email: "",
          phone: "",
          prn: "",
          department: "Computer Engineering",
          year: "Third Year",
          division: "A",
        },
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

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrorMessage("Please select a valid PNG, JPG, JPEG, or WebP image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    setErrorMessage("");
    setScreenshotFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setScreenshotFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (config?.registrationOpen === false) {
      setErrorMessage("Registrations for TECHNEX 2K26 are currently closed.");
      return;
    }

    if (!formData.membershipType) {
      setErrorMessage("Please select a membership category.");
      return;
    }

    if (!formData.teamName.trim()) {
      setErrorMessage("Team name is required.");
      return;
    }
    if (!formData.projectTitle.trim()) {
      setErrorMessage("Project title is required.");
      return;
    }
    if (!formData.domain) {
      setErrorMessage("Please select a domain track.");
      return;
    }
    if (!formData.leaderName.trim()) {
      setErrorMessage("Team leader name is required.");
      return;
    }
    if (!formData.leaderEmail.trim()) {
      setErrorMessage("Team leader email is required.");
      return;
    }
    if (!formData.leaderPhone.trim() || formData.leaderPhone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Valid 10-digit leader phone number is required.");
      return;
    }
    if (!formData.leaderCollege.trim()) {
      setErrorMessage("Leader college name is required.");
      return;
    }
    if (!formData.leaderPrn.trim()) {
      setErrorMessage("Leader PRN / Roll Number is required.");
      return;
    }

    if (!formData.utr.trim() || formData.utr.trim().length < 4) {
      setErrorMessage("Please enter a valid UPI Transaction ID / UTR reference number.");
      return;
    }

    if (!screenshotFile) {
      setErrorMessage("Please upload your payment screenshot before submitting.");
      return;
    }

    for (let i = 0; i < formData.teamMembers.length; i++) {
      const m = formData.teamMembers[i];
      if (!m.name.trim() || !m.email.trim()) {
        setErrorMessage(`Please provide name and email for Member #${i + 2}.`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("membershipType", formData.membershipType);
      payload.append("teamName", formData.teamName.trim());
      payload.append("projectTitle", formData.projectTitle.trim());
      payload.append("domain", formData.domain);
      payload.append("abstractSummary", (formData.abstractSummary || "").trim());
      payload.append("githubOrDriveUrl", (formData.githubOrDriveUrl || "").trim());
      payload.append("leaderName", formData.leaderName.trim());
      payload.append("leaderEmail", formData.leaderEmail.trim());
      payload.append("leaderPhone", formData.leaderPhone.trim());
      payload.append("leaderCollege", formData.leaderCollege.trim());
      payload.append("leaderPrn", formData.leaderPrn.trim());
      payload.append("leaderDepartment", (formData.leaderDepartment || "").trim());
      payload.append("leaderYear", (formData.leaderYear || "").trim());
      payload.append("leaderDivision", (formData.leaderDivision || "").trim());
      payload.append("teamMembers", JSON.stringify(formData.teamMembers));
      payload.append("utr", formData.utr.trim());
      payload.append("screenshot", screenshotFile);

      const res = await fetch("/api/technex", {
        method: "POST",
        body: payload,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const regId =
          json.registrationId ||
          json.registrationCode ||
          json.id ||
          json.data?.registrationId ||
          json.data?.registrationCode ||
          json.data?.id;

        const regData = json.data || json;
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(`technex_reg_${regId}`, JSON.stringify(regData));
            sessionStorage.setItem("technex_latest_reg", JSON.stringify(regData));
          } catch (e) {}
        }

        setToast({ type: "success", message: "TECHNEX 2K26 Registration Successful! Redirecting..." });
        window.location.href = `/registration/success?id=${encodeURIComponent(regId)}`;
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

  if (loadingConfig) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-brand-muted">Loading TECHNEX 2K26 event details from database...</p>
      </div>
    );
  }

  const domainsList = config?.domains || [
    "Artificial Intelligence & ML",
    "Data Science & Predictive Analytics",
    "Web3 & Decentralized Apps",
    "IoT, Robotics & Embedded Systems",
    "Cloud Architecture & DevOps",
    "Open Track: Interdisciplinary Innovation",
  ];

  const membershipTiers = config?.membershipTiers || [
    { id: "s4ds", name: "S4DS Member", fee: 49, description: "Active S4DS Chapter Member (PRN required)" },
    { id: "non-s4ds", name: "Non-S4DS Member", fee: 99, description: "Student from MITAOE or other recognized colleges" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* ── Banner Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-xs font-bold text-brand-orange uppercase tracking-wider">
            <Flame className="w-4 h-4 text-brand-yellow" /> Project Expo
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-brand-white tracking-tight leading-tight">
            {config?.title || "TECHNEX 2K26"}
          </h1>

          <p className="text-base sm:text-lg text-brand-secondary leading-relaxed">
            {config?.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-background-card border border-brand-border space-y-1">
              <Calendar className="w-5 h-5 text-brand-orange" />
              <div className="text-xs text-brand-muted">Date</div>
              <div className="text-sm font-bold text-brand-white">{config?.date || "Nov 21, 2026"}</div>
            </div>
            <div className="p-4 rounded-2xl bg-background-card border border-brand-border space-y-1">
              <MapPin className="w-5 h-5 text-brand-orange" />
              <div className="text-xs text-brand-muted">Venue</div>
              <div className="text-sm font-bold text-brand-white truncate" title={config?.venue}>
                {config?.venue?.split(",")[0] || "MITAOE Campus"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-background-card border border-brand-border space-y-1 col-span-2 sm:col-span-1">
              <Clock className="w-5 h-5 text-brand-orange" />
              <div className="text-xs text-brand-muted">Format</div>
              <div className="text-sm font-bold text-brand-white">{config?.mode || "Offline Project Expo"}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden border-2 border-brand-orange/30 shadow-2xl shadow-brand-red/20 bg-background-card">
            <Image
              src={config?.posterUrl || "/images/technex-poster.png"}
              alt={`${config?.title || "TECHNEX 2K26"} Official Expo Poster`}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
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
          {domainsList.map((d, idx) => (
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

      {/* ── Registration Form ── */}
      <div className="pt-8 border-t border-brand-border">
        {config?.registrationOpen === false ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-background-card border border-brand-border text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white">Registrations Currently Closed</h3>
            <p className="text-sm text-brand-muted max-w-md mx-auto">
              Registrations for TECHNEX 2K26 are either closed or the deadline has passed. Please contact the chapter organizers for queries.
            </p>
            <Link href="/contact" className="inline-block mt-4 px-6 py-2.5 rounded-xl brand-btn text-xs font-bold uppercase tracking-wider text-white">
              Contact Organizers
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-12 rounded-3xl bg-background-card border border-brand-border space-y-8 shadow-xl"
          >
            <div className="border-b border-brand-border pb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-white">
                Team Registration Portal
              </h2>
              <p className="text-sm text-brand-muted mt-1">
                Teams can consist of {config?.minTeamSize || 1} to {config?.maxTeamSize || 4} members. Complete your team information, submit payment details, and register directly below.
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
                Select your team&apos;s membership classification to apply the configured registration fee.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {membershipTiers.map((tier) => (
                  <div
                    key={tier.id || tier.name}
                    onClick={() => handleMembershipChange(tier.name, Number(tier.fee))}
                    className={`relative p-5 rounded-2xl cursor-pointer transition-all border ${
                      formData.membershipType === tier.name
                        ? "border-brand-orange bg-gradient-to-br from-[#EC3507]/20 via-[#FC8706]/15 to-[#302016] ring-2 ring-brand-orange shadow-xl shadow-brand-red/10"
                        : "border-brand-border bg-background-elevated hover:border-brand-orange/50 hover:bg-background-secondary"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-brand-white">
                            {tier.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-brand-secondary leading-relaxed">
                          {tier.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-2xl font-black font-mono text-brand-yellow">₹{tier.fee}</span>
                        <span className="text-[10px] text-brand-muted block">per team</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 2: Project Information ── */}
            <div className="space-y-4 pt-4 border-t border-brand-border">
              <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-brand-yellow" /> 2. Project Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neural Pioneers"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous Edge-AI Navigation System"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Domain / Competition Track *
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                >
                  {domainsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Abstract / Project Brief (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize the core problem statement, methodology, and tech stack of your project..."
                  value={formData.abstractSummary}
                  onChange={(e) => setFormData({ ...formData, abstractSummary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  GitHub / Drive Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/your-team/project"
                  value={formData.githubOrDriveUrl}
                  onChange={(e) => setFormData({ ...formData, githubOrDriveUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            {/* ── SECTION 3: Team Leader Details ── */}
            <div className="space-y-4 pt-4 border-t border-brand-border">
              <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-yellow" /> 3. Team Leader Details (Primary Contact)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    Leader Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harsh Holkar"
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
                    placeholder="e.g. leader@mitaoe.ac.in"
                    value={formData.leaderEmail}
                    onChange={(e) => setFormData({ ...formData, leaderEmail: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    Leader WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.leaderPhone}
                    onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    College / Institute Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MIT Academy of Engineering, Pune"
                    value={formData.leaderCollege}
                    onChange={(e) => setFormData({ ...formData, leaderCollege: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    Leader PRN / Student Roll Number *
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    Leader Department *
                  </label>
                  <select
                    value={formData.leaderDepartment}
                    onChange={(e) => setFormData({ ...formData, leaderDepartment: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                  >
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="AIML">AIML</option>
                    <option value="Electronics & Telecommunication">Electronics &amp; Telecommunication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Design / Other">Design / Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    Academic Year *
                  </label>
                  <select
                    value={formData.leaderYear}
                    onChange={(e) => setFormData({ ...formData, leaderYear: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                  >
                    <option value="First Year">First Year (FY)</option>
                    <option value="Second Year">Second Year (SY)</option>
                    <option value="Third Year">Third Year (TY)</option>
                    <option value="Final Year">Final Year (B.Tech)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    Division / Section
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A, B, C or Div 1"
                    value={formData.leaderDivision}
                    onChange={(e) => setFormData({ ...formData, leaderDivision: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>

            {/* ── SECTION 4: Team Members ── */}
            <div className="space-y-4 pt-4 border-t border-brand-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-yellow" /> 4. Additional Team Members (Optional)
                  </h3>
                  <p className="text-xs text-brand-secondary mt-0.5">
                    Teams can include {config?.minTeamSize || 1} to {config?.maxTeamSize || 4} members total. You have added {formData.teamMembers.length} additional member(s).
                  </p>
                </div>

                {formData.teamMembers.length < (config?.maxTeamSize || 4) - 1 && (
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
                          placeholder="Member Full Name *"
                          value={member.name}
                          onChange={(e) => updateMember(idx, "name", e.target.value)}
                          className="px-3 py-2 rounded-lg bg-background-card border border-brand-border text-brand-white text-xs"
                        />
                        <input
                          type="email"
                          placeholder="Member Email *"
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
                        <select
                          value={member.department || "Computer Engineering"}
                          onChange={(e) => updateMember(idx, "department", e.target.value)}
                          className="px-3 py-2 rounded-lg bg-background-card border border-brand-border text-brand-white text-xs"
                        >
                          <option value="Computer Engineering">Computer Engineering</option>
                          <option value="AI & Data Science">AI &amp; Data Science</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Electronics & Telecommunication">Electronics &amp; Telecom</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Chemical Engineering">Chemical Engineering</option>
                          <option value="Design / Other">Design / Other</option>
                        </select>
                        <select
                          value={member.year || "Third Year"}
                          onChange={(e) => updateMember(idx, "year", e.target.value)}
                          className="px-3 py-2 rounded-lg bg-background-card border border-brand-border text-brand-white text-xs"
                        >
                          <option value="First Year">First Year (FY)</option>
                          <option value="Second Year">Second Year (SY)</option>
                          <option value="Third Year">Third Year (TY)</option>
                          <option value="Final Year">Final Year (B.Tech)</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Division (e.g. A, B)"
                          value={member.division || ""}
                          onChange={(e) => updateMember(idx, "division", e.target.value)}
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

              {/* QR Code & Instructions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-background-elevated border border-brand-orange/30 shadow-lg">
                {/* QR Image Box */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#17110D] border border-brand-border space-y-3">
                  <div className="relative w-52 h-52 rounded-xl overflow-hidden border-2 border-brand-orange/40 bg-white p-2 shadow-inner flex items-center justify-center">
                    <Image
                      key={`qr-${formData.registrationFee}`}
                      src={`/api/technex/qr?amount=${formData.registrationFee}&tier=${encodeURIComponent(formData.membershipType)}`}
                      alt={`Official Payment QR Code for ₹${formData.registrationFee}`}
                      width={200}
                      height={200}
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                  <div className="text-center space-y-1 w-full">
                    <span className="text-xs font-black text-brand-yellow uppercase tracking-wider block">
                      Scan to Pay ₹{formData.registrationFee}
                    </span>
                    <span className="text-[10px] text-brand-muted block pt-0.5">
                      Accepts Google Pay, PhonePe, Paytm &amp; all UPI apps
                    </span>
                  </div>
                  {/* Copy UPI ID Widget */}
                  <div className="w-full flex items-center justify-between p-2 rounded-xl bg-background-card border border-brand-border text-xs">
                    <div className="flex flex-col text-left truncate mr-2">
                      <span className="text-[9px] uppercase font-bold text-brand-muted">UPI ID:</span>
                      <span className="font-mono text-white text-[11px] truncate">
                        {config?.upiId || "9172106568@airtel"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const id = config?.upiId || "9172106568@airtel";
                        navigator.clipboard.writeText(id);
                        setToast({ type: "success", message: `Copied UPI ID: ${id}` });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-background-elevated hover:bg-brand-orange/20 border border-brand-border text-brand-orange hover:text-brand-yellow font-bold text-xs flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>

                {/* Instructions & UPI Details */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-brand-white pb-2 border-b border-brand-border">
                      Official Payment Instructions:
                    </div>

                    <div className="text-xs text-brand-secondary whitespace-pre-line leading-relaxed">
                      {config?.paymentInstructions}
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
                  <span className="text-[10px] text-brand-muted normal-case font-normal">PNG, JPG, JPEG or WebP (Max 5MB)</span>
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
                          Accepts PNG, JPG, JPEG or WebP up to 5MB
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp"
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
                          accept="image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp"
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
                      {formData.membershipType}
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
        )}
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
