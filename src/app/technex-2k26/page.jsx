"use client";

import { useState } from "react";
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
  });

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

    try {
      const res = await fetch("/api/technex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      setErrorMessage("Network error during submission.");
    } finally {
      setSubmitting(false);
    }
  };

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

          {/* ── SECTION 5: Dynamic Registration Fee Summary & Submission ── */}
          <div className="pt-6 border-t border-brand-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-yellow" /> 5. Registration Fee &amp; Confirmation
              </h3>
            </div>

            {/* Dynamic Registration Fee Summary Card */}
            <div className="p-6 rounded-2xl bg-background-elevated border border-brand-orange/30 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                  Registration Fee Summary
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-orange/20 text-brand-yellow border border-brand-orange/30">
                  {formData.membershipType}
                </span>
              </div>
              <div className="space-y-2.5 text-xs text-brand-secondary">
                <div className="flex justify-between items-center">
                  <span>Selected Membership Tier:</span>
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
                <div className="flex justify-between items-center pt-3 border-t border-brand-border text-sm font-bold text-brand-white">
                  <span>Applicable Registration Fee:</span>
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
            {submitting ? "Submitting Registration..." : `Complete TECHNEX 2K26 Registration (${formData.membershipType}: ₹${formData.registrationFee})`}
          </button>
        </form>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}