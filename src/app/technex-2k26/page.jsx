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
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Users,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Info,
} from "lucide-react";
import Toast from "@/components/Toast";

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
    transactionId: "",
    paymentProofUrl: "",
  });

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("/images/payment-qr.png");
  const [activePaymentQr, setActivePaymentQr] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [toast, setToast] = useState(null);

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "9172106568@airtel";

  // Fetch active payment QR from Supabase via backend endpoint
  useEffect(() => {
    fetch("/api/media/active?category=payment-qr")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.fileUrl) {
          setActivePaymentQr(json.data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch active Supabase QR:", err);
      });
  }, []);

  // Dynamically generate genuine UPI QR code whenever fee or membership changes
  useEffect(() => {
    let active = true;
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("S4DS MITAOE")}&am=${formData.registrationFee}&cu=INR&tn=${encodeURIComponent("TECHNEX2K26 Registration")}`;

    import("qrcode")
      .then((QRCode) => {
        QRCode.toDataURL(upiUri, {
          width: 512,
          margin: 2,
          color: {
            dark: "#0D0A08",
            light: "#FFFFFF",
          },
        })
          .then((url) => {
            if (active) setQrCodeDataUrl(url);
          })
          .catch(() => {
            if (active) setQrCodeDataUrl("/images/payment-qr.png");
          });
      })
      .catch(() => {
        if (active) setQrCodeDataUrl("/images/payment-qr.png");
      });

    return () => {
      active = false;
    };
  }, [formData.registrationFee, upiId]);

  const handleCopyUpi = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setToast({ type: "info", message: "UPI ID copied to clipboard!" });
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const domains = [
    "Artificial Intelligence & ML",
    "Data Science & Predictive Analytics",
    "Web3 & Decentralized Apps",
    "IoT, Robotics & Embedded Systems",
    "Cloud Architecture & DevOps",
    "Open Track: Interdisciplinary Innovation",
  ];

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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage("");

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("category", "payment-screenshot");
      data.append("title", `TECHNEX Payment - ${formData.teamName || "Team"} - UTR ${formData.transactionId || "Receipt"}`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.success) {
        setFormData((prev) => ({ ...prev, paymentProofUrl: json.url }));
        setToast({ type: "success", message: "Payment receipt uploaded!" });
      } else {
        setErrorMessage(json.error || "Failed to upload image");
      }
    } catch (err) {
      setErrorMessage("Network error during image upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    // Validation
    if (!formData.membershipType || !["S4DS Member", "Non-S4DS Member"].includes(formData.membershipType)) {
      setErrorMessage("Please select a valid Membership Category (S4DS Member or Non-S4DS Member).");
      setSubmitting(false);
      return;
    }
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
    if (!formData.transactionId || formData.transactionId.trim().length < 4) {
      setErrorMessage("Please provide the UPI Payment Transaction ID (UTR).");
      setSubmitting(false);
      return;
    }
    if (!formData.paymentProofUrl) {
      setErrorMessage("Please upload your UPI payment screenshot receipt to proceed.");
      setSubmitting(false);
      return;
    }
    if (!paymentConfirmed) {
      setErrorMessage("Please check the confirmation box verifying that you have completed the UPI payment.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/technex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessData(json.data);
        setToast({ type: "success", message: "TECHNEX 2K26 Registration Successful!" });
      } else {
        setErrorMessage(json.error || "Failed to submit registration. Please verify details.");
      }
    } catch (err) {
      setErrorMessage("Network error during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-background-card border border-brand-orange/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center mx-auto text-brand-orange">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-orange/20 text-brand-yellow uppercase tracking-wider border border-brand-orange/30">
            Registration Confirmed
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-brand-white">
            Team {successData.teamName} Registered!
          </h1>

          <p className="text-brand-secondary max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Your project <strong className="text-brand-white">&quot;{successData.projectTitle}&quot;</strong> has been
            registered for TECHNEX 2K26. Save your Registration Code below for on-campus verification and booth allocation.
          </p>

          <div className="p-6 rounded-2xl bg-background-elevated border border-brand-border max-w-md mx-auto space-y-3 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-brand-border">
              <span className="text-xs text-brand-muted">Registration Code:</span>
              <span className="font-mono text-xl font-black text-brand-yellow">
                {successData.registrationCode}
              </span>
            </div>
            <div className="flex justify-between text-xs text-brand-secondary">
              <span className="text-brand-muted">Membership Category:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-orange/20 text-brand-yellow border border-brand-orange/40">
                {successData.membershipType}
              </span>
            </div>
            <div className="flex justify-between text-xs text-brand-secondary">
              <span className="text-brand-muted">Verified Fee:</span>
              <span className="font-bold text-brand-white font-mono">₹{successData.registrationFee}</span>
            </div>
            <div className="flex justify-between text-xs text-brand-secondary">
              <span className="text-brand-muted">Payment Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-brand-yellow border border-amber-500/40">
                {successData.paymentStatus || "Pending Verification"}
              </span>
            </div>
            <div className="flex justify-between text-xs text-brand-secondary">
              <span className="text-brand-muted">Domain:</span>
              <span className="font-semibold text-brand-white">{successData.domain}</span>
            </div>
            <div className="flex justify-between text-xs text-brand-secondary">
              <span className="text-brand-muted">Team Leader:</span>
              <span>{successData.leaderName}</span>
            </div>
            <div className="flex justify-between text-xs text-brand-secondary">
              <span className="text-brand-muted">Total Members:</span>
              <span>{1 + (successData.teamMembers?.length || 0)} Members</span>
            </div>
            <div className="flex justify-between text-xs text-brand-secondary pt-2 border-t border-brand-border font-mono">
              <span className="text-brand-muted">UTR / Ref:</span>
              <span className="text-brand-secondary">{successData.transactionId}</span>
            </div>
            {successData.paymentProofUrl && (
              <div className="pt-2 text-xs">
                <a
                  href={successData.paymentProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-orange hover:text-brand-yellow hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Uploaded Receipt Screenshot
                </a>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-background-secondary hover:bg-background-elevated text-brand-white text-sm font-semibold border border-brand-border transition-colors"
            >
              Return Home
            </Link>
            <Link
              href="/events"
              className="px-6 py-2.5 rounded-xl brand-btn text-brand-white text-sm font-bold shadow-md"
            >
              Explore Other Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* ── Banner Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-border text-xs font-bold text-brand-orange uppercase tracking-wider">
            <Flame className="w-4 h-4 text-brand-yellow" /> Event
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-brand-white tracking-tight leading-tight">
            TECHNEX 2K26 <br />
            <span className="brand-text-gradient">
              Project Innovation Expo
            </span>
          </h1>

          <p className="text-base sm:text-lg text-brand-secondary leading-relaxed">
            The annual benchmark exhibition for undergraduate engineering talent. Present your prototypes,
            interact with venture mentors, demonstrate breakthrough research, and earn national recognition.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-background-card border border-brand-border flex items-center gap-3">
              <Calendar className="w-6 h-6 text-brand-yellow shrink-0" />
              <div>
                <span className="text-xs text-brand-muted block">Expo Date</span>
                <span className="text-base font-bold text-brand-white">Nov 21, 2026</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-background-card border border-brand-border flex items-center gap-3">
              <MapPin className="w-6 h-6 text-brand-orange shrink-0" />
              <div>
                <span className="text-xs text-brand-muted block">Campus Venue</span>
                <span className="text-base font-bold text-brand-white">MITAOE Pune</span>
              </div>
            </div>
          </div>
        </div>

        {/* Poster Visual Card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden border-2 border-brand-orange/40 shadow-2xl shadow-brand-red/10 aspect-[4/5] bg-background-card">
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
              Teams can consist of 1 to 4 members. Select your membership category below to begin.
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
                <span className="px-2.5 py-1 rounded-lg bg-brand-orange/20 text-brand-yellow font-extrabold border border-brand-orange/40 text-sm">
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
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                        formData.membershipType === "S4DS Member"
                          ? "border-brand-orange bg-brand-orange text-white"
                          : "border-brand-muted/50 bg-background-card"
                      }`}
                    >
                      {formData.membershipType === "S4DS Member" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-brand-white">S4DS Member</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-orange/20 text-brand-yellow border border-brand-orange/40">
                          Chapter Benefit
                        </span>
                      </div>
                      <p className="text-xs text-brand-secondary mt-1.5 leading-relaxed">
                        For enrolled student members of Society for Data Science (S4DS) MITAOE Chapter.
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black text-brand-yellow">₹49</span>
                    <span className="block text-[10px] uppercase font-bold text-brand-muted">Per Team</span>
                  </div>
                </div>

                {formData.membershipType === "S4DS Member" && (
                  <div className="mt-4 pt-3 border-t border-brand-orange/30 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> S4DS Member Selected
                    </span>
                    <span className="font-bold text-brand-white">Payable: ₹49</span>
                  </div>
                )}
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
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                        formData.membershipType === "Non-S4DS Member"
                          ? "border-brand-orange bg-brand-orange text-white"
                          : "border-brand-muted/50 bg-background-card"
                      }`}
                    >
                      {formData.membershipType === "Non-S4DS Member" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-brand-white">Non-S4DS Member</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-background-secondary text-brand-secondary border border-brand-border">
                          General Entry
                        </span>
                      </div>
                      <p className="text-xs text-brand-secondary mt-1.5 leading-relaxed">
                        Open to all college students, universities, external participants, and non-members.
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black text-brand-yellow">₹99</span>
                    <span className="block text-[10px] uppercase font-bold text-brand-muted">Per Team</span>
                  </div>
                </div>

                {formData.membershipType === "Non-S4DS Member" && (
                  <div className="mt-4 pt-3 border-t border-brand-orange/30 flex items-center justify-between text-xs text-brand-yellow font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-yellow" /> Non-S4DS Member Selected
                    </span>
                    <span className="font-bold text-brand-white">Payable: ₹99</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SECTION 2: Project Details ── */}
          <div className="pt-6 border-t border-brand-border space-y-5">
            <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-yellow" /> 2. Project Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NeuralKnights"
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
                  placeholder="e.g. Real-Time Forest Fire Detection via Drone Swarms"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Competition Track / Domain *
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange cursor-pointer"
                >
                  {domains.map((d) => (
                    <option key={d} value={d} className="bg-background-card text-brand-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Project Abstract / Problem Statement
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what your prototype solves..."
                  value={formData.abstractSummary}
                  onChange={(e) => setFormData({ ...formData, abstractSummary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  GitHub Repository / Drive Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/myteam/project"
                  value={formData.githubOrDriveUrl}
                  onChange={(e) => setFormData({ ...formData, githubOrDriveUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 3: Team Leader ── */}
          <div className="pt-6 border-t border-brand-border space-y-5">
            <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider">
              3. Team Leader Coordinates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Leader Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Leader name"
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
                  placeholder="leader@mitaoe.ac.in"
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
                  placeholder="10-digit number"
                  value={formData.leaderPhone}
                  onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Leader PRN / Student ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 202301040050"
                  value={formData.leaderPrn}
                  onChange={(e) => setFormData({ ...formData, leaderPrn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  College / Institution Name *
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
            </div>
          </div>

          {/* ── SECTION 4: Additional Team Members ── */}
          <div className="pt-6 border-t border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-yellow" /> 4. Additional Team Members ({formData.teamMembers.length} / 3)
              </h3>
              {formData.teamMembers.length < 3 && (
                <button
                  type="button"
                  onClick={addMember}
                  className="px-3.5 py-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary text-xs font-bold text-brand-yellow flex items-center gap-1.5 border border-brand-border hover:border-brand-orange transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Member
                </button>
              )}
            </div>

            {formData.teamMembers.length === 0 ? (
              <p className="text-xs text-brand-muted italic">
                No additional members added. Participating as a solo team leader.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-background-elevated border border-brand-border space-y-4 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-brand-orange">
                        Member #{idx + 2}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        className="text-brand-muted hover:text-rose-400 p-1 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* ── SECTION 5: Dynamic Registration Fee Summary & Payment Verification ── */}
          <div className="pt-6 border-t border-brand-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-yellow" /> 5. Payment & Registration Fee
              </h3>
            </div>

            {/* Dynamic Registration Fee Summary Card */}
            <div className="p-5 rounded-2xl bg-background-elevated border border-brand-orange/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                  Registration Fee Summary
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-orange/20 text-brand-yellow border border-brand-orange/30">
                  {formData.membershipType}
                </span>
              </div>
              <div className="space-y-2 text-xs text-brand-secondary">
                <div className="flex justify-between items-center">
                  <span>Selected Category:</span>
                  <span className="font-semibold text-brand-white">
                    {formData.membershipType === "S4DS Member" ? "S4DS Student Chapter Member (₹49)" : "Non-S4DS General Participant (₹99)"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Team Size:</span>
                  <span className="font-semibold text-brand-white">
                    1 Leader + {formData.teamMembers.length} Members ({1 + formData.teamMembers.length} Total)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-brand-border text-sm font-bold text-brand-white">
                  <span>Total Payable Registration Fee:</span>
                  <span className="text-brand-yellow text-2xl font-black font-mono">
                    ₹{formData.registrationFee}
                  </span>
                </div>
              </div>
            </div>

            {/* ── DEDICATED PAYMENT QR SECTION: "SCAN & PAY" ── */}
            <div className="p-6 rounded-3xl bg-background-card border-2 border-brand-orange/40 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                <div>
                  <div className="flex items-center gap-2 text-brand-orange font-bold text-xs uppercase tracking-wider">
                    <QrCode className="w-4 h-4" /> Official Payment Gateway
                  </div>
                  <h4 className="text-2xl font-black text-brand-white mt-0.5 flex items-center gap-2">
                    Scan &amp; Pay
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-muted">Amount to Pay:</span>
                  <span className="px-3 py-1 rounded-xl bg-brand-orange/20 text-brand-yellow font-black text-lg font-mono border border-brand-orange/40">
                    ₹{formData.registrationFee}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Official QR Code Box */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-background-elevated border border-brand-border space-y-3">
                  <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-brand-orange/30 flex items-center justify-center w-56 h-56 relative group">
                    <img
                      src={activePaymentQr?.fileUrl || qrCodeDataUrl || "/images/payment-qr.png"}
                      alt="Official S4DS TECHNEX Payment QR Code"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/payment-qr.png";
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-brand-yellow block">
                      Official S4DS Payment QR
                    </span>
                    <span className="text-[10px] text-brand-muted">
                      Pre-configured for ₹{formData.registrationFee} • NPCI Verified
                    </span>
                  </div>

                  {/* Direct Mobile UPI Intent Button */}
                  <a
                    href={`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("S4DS MITAOE")}&am=${formData.registrationFee}&cu=INR&tn=${encodeURIComponent("TECHNEX2K26 Registration")}`}
                    className="sm:hidden w-full py-2 px-3 rounded-xl brand-btn text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Pay via UPI App Directly
                  </a>
                </div>

                {/* Instructions & UPI Details */}
                <div className="md:col-span-7 space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-brand-white flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-brand-orange" /> How to Pay via UPI
                    </h5>
                    <p className="text-xs text-brand-secondary leading-relaxed">
                      Scan the official QR code using any supported UPI mobile application. Transfer exactly <strong className="text-brand-yellow">₹{formData.registrationFee}</strong> to complete your entry.
                    </p>
                  </div>

                  {/* UPI ID Copy Card */}
                  <div className="p-3 rounded-xl bg-background-elevated border border-brand-border flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider block">
                        Official Chapter UPI ID:
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-white">
                        {upiId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 rounded-lg bg-background-card hover:bg-background-secondary border border-brand-border text-xs text-brand-yellow hover:text-brand-white font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedUpi ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* Supported UPI Apps */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider block">
                      Supported UPI Applications:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Google Pay", "PhonePe", "Paytm", "BHIM UPI", "Amazon Pay", "CRED"].map((app) => (
                        <span
                          key={app}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-background-elevated border border-brand-border text-brand-secondary"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Verification Notice */}
                  <div className="p-3 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-[11px] text-brand-muted space-y-1">
                    <div className="flex items-center gap-1.5 text-brand-yellow font-bold text-xs">
                      <Info className="w-3.5 h-3.5" /> Verification Process
                    </div>
                    <p>
                      Initial payment status will be <strong>Pending Verification</strong>. Our administrator will verify your 12-digit UTR and payment screenshot within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PAYMENT CONFIRMATION FORM (UTR + Screenshot + Checkbox) ── */}
            <div className="p-6 rounded-3xl bg-background-elevated border border-brand-border space-y-5">
              <h4 className="text-sm font-bold text-brand-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Payment Confirmation &amp; Proof
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* UTR Input */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary flex items-center justify-between">
                    <span>UPI Transaction ID / UTR *</span>
                    <span className="text-[10px] text-brand-muted font-normal lowercase">(12-digit reference number)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 431987102938"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background-card border border-brand-border text-brand-white text-sm font-mono focus:outline-none focus:border-brand-orange"
                  />
                  <p className="text-[11px] text-brand-muted">
                    Locate the 12-digit UTR/Transaction Reference number from your payment confirmation screen or bank SMS.
                  </p>
                </div>

                {/* Screenshot Upload */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary flex items-center justify-between">
                    <span>Upload Payment Screenshot (PNG/JPG/WEBP) *</span>
                    <span className="text-[10px] text-rose-400 font-normal">Required for Verification</span>
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="px-5 py-3 rounded-xl bg-background-card hover:bg-background-secondary border border-brand-border text-xs font-bold text-brand-secondary hover:text-brand-white cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-sm">
                      <Upload className="w-4 h-4 text-brand-orange" />
                      {uploading ? "Uploading receipt..." : "Choose Payment Screenshot"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>

                    {formData.paymentProofUrl ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Screenshot Attached
                        </span>
                        <a
                          href={formData.paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-brand-orange hover:text-brand-yellow hover:underline flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" /> View Uploaded File
                        </a>
                      </div>
                    ) : (
                      <span className="text-[11px] text-brand-muted italic">
                        Please upload your payment receipt before submitting.
                      </span>
                    )}
                  </div>
                </div>

                {/* Payment Confirmation Checkbox */}
                <div className="sm:col-span-2 pt-2 border-t border-brand-border">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="paymentConfirmed"
                      checked={paymentConfirmed}
                      onChange={(e) => setPaymentConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-brand-border text-brand-orange focus:ring-brand-orange focus:ring-offset-0 bg-background-card cursor-pointer accent-brand-orange"
                      required
                    />
                    <span className="text-xs text-brand-secondary group-hover:text-brand-white transition-colors leading-relaxed">
                      I confirm that I have transferred <strong className="text-brand-yellow">₹{formData.registrationFee}</strong> to the official S4DS chapter UPI ID (<code className="text-brand-white">{upiId}</code>) and that the UTR reference and payment screenshot provided above are authentic and genuine.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-4 rounded-xl brand-btn text-white font-extrabold text-base transition-transform hover:scale-[1.01] shadow-xl shadow-brand-red/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? "Confirming Registration..." : `Complete TECHNEX 2K26 Registration (Pay ₹${formData.registrationFee})`}
          </button>
        </form>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
