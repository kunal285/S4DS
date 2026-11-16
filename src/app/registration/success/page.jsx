"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Sparkles,
  Printer,
  HelpCircle,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Registration ID is missing. Please check your confirmation link or submit a registration.");
      setLoading(false);
      return;
    }

    const fetchUrl = `/api/technex/confirm?id=${encodeURIComponent(id)}`;

    fetch(fetchUrl)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Registration record not found.");
        }
        return json;
      })
      .then((json) => {
        if (json.success && json.data) {
          setRegistration(json.data);
        } else {
          setError(json.error || "Unable to retrieve registration details.");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load registration details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleCopyCode = () => {
    if (!registration) return;
    const code = registration.registrationCode || registration.registrationId || registration.id;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-brand-secondary font-semibold">
          Loading registration details...
        </p>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#17110D] border border-rose-500/30 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Registration Not Found
          </h1>
          <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
            {error || "We could not find a registration matching this ID. Please verify your Registration ID or contact the organizing committee."}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/technex-2k26"
              className="px-6 py-3 rounded-xl brand-btn text-white text-xs font-bold transition-transform hover:scale-105 shadow-md"
            >
              Go to TECHNEX 2K26
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-[#24170F] text-brand-secondary hover:text-white border border-[rgba(252,135,6,0.25)] text-xs font-semibold transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* ── TOP HERO CONFIRMATION ── */}
      <div className="text-center space-y-4">
        {/* Animated Celebration Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand-orange/20 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-brand-red via-brand-orange to-brand-yellow p-1 shadow-2xl shadow-brand-red/30">
            <div className="w-full h-full bg-[#17110D] rounded-full flex items-center justify-center text-brand-yellow">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-[rgba(252,135,6,0.30)] text-xs font-bold text-brand-orange uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-brand-yellow" /> TECHNEX 2K26 Registered
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Registration <span className="brand-text-gradient">Successful!</span>
        </h1>

        <p className="text-base sm:text-lg text-[#FFF1DF] max-w-2xl mx-auto leading-relaxed">
          Your TECHNEX 2K26 registration has been submitted successfully. Thank you for being part of the event!
        </p>

        {/* Confirmation Pill */}
        <div className="pt-2 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-xs sm:text-sm font-extrabold text-emerald-300 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Registration Confirmed
          </span>
        </div>
      </div>

      {/* ── EVENT DETAILS STRIP ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#17110D] border border-[rgba(252,135,6,0.25)] flex items-center gap-3 shadow-md">
          <Sparkles className="w-6 h-6 text-brand-yellow shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#B8A99A] block">Event</span>
            <span className="text-xs sm:text-sm font-bold text-white">{registration.eventTitle || "TECHNEX 2K26 Expo"}</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[#17110D] border border-[rgba(252,135,6,0.25)] flex items-center gap-3 shadow-md">
          <Calendar className="w-6 h-6 text-brand-orange shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#B8A99A] block">Expo Date</span>
            <span className="text-xs sm:text-sm font-bold text-white">{registration.eventDate || "Nov 28, 2026"}</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[#17110D] border border-[rgba(252,135,6,0.25)] flex items-center gap-3 shadow-md">
          <MapPin className="w-6 h-6 text-brand-yellow shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#B8A99A] block">Campus Venue</span>
            <span className="text-xs sm:text-sm font-bold text-white">{registration.eventVenue || "MITAOE, Alandi, Pune"}</span>
          </div>
        </div>
      </div>

      {/* ── OFFICIAL WHATSAPP GROUP CALLOUT (PROMINENT GREEN BUTTON) ── */}
      {registration.whatsappEnabled && registration.whatsappUrl && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#17110D] via-[#1b251d] to-[#121c14] border-2 border-[#25D366]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#25D366]">
                <WhatsAppIcon className="w-4 h-4" /> Official Event Channel
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Join the Official TECHNEX 2K26 WhatsApp Group
              </h3>
              <p className="text-xs sm:text-sm text-[#FFF1DF]/90 max-w-xl leading-relaxed">
                Stay updated with immediate announcements, expo hall room allocations, timetable updates, mentor office hours, and jury evaluation schedules.
              </p>
            </div>

            <a
              href={registration.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-[#25D366]/30 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current" />
              JOIN OFFICIAL WHATSAPP GROUP
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* ── REGISTRATION DETAILS & SUMMARY ── */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#17110D] border border-[rgba(252,135,6,0.25)] space-y-8 shadow-2xl">
        {/* Registration ID Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(252,135,6,0.20)]">
          <div>
            <span className="text-xs font-semibold text-[#B8A99A] uppercase tracking-wider block">
              Official Registration ID:
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wider">
                {registration.registrationCode || registration.registrationId || registration.id}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-[#24170F] hover:bg-[#302016] border border-[rgba(252,135,6,0.30)] text-xs font-semibold text-brand-orange hover:text-brand-yellow flex items-center gap-1.5 transition-colors"
                title="Copy Registration ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy ID"}
              </button>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-semibold text-[#B8A99A] uppercase tracking-wider block mb-1">
              Registration Status:
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Successfully Registered
            </span>
          </div>
        </div>

        {/* Confirmation Info Notice */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 text-xs text-emerald-200/90 leading-relaxed">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-300 block mb-0.5">Registration Confirmed in RushDB</strong>
            Your team registration has been securely recorded for TECHNEX 2K26. Save your Registration ID above for check-in on expo day at the MITAOE campus.
          </div>
        </div>

        {/* Key Team Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-[#24170F] border border-[rgba(252,135,6,0.20)] space-y-1">
            <span className="text-[11px] font-bold text-[#B8A99A] uppercase tracking-wider block">
              Team Name
            </span>
            <span className="text-base font-bold text-white block truncate">
              {registration.teamName}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#24170F] border border-[rgba(252,135,6,0.20)] space-y-1">
            <span className="text-[11px] font-bold text-[#B8A99A] uppercase tracking-wider block">
              Team Leader
            </span>
            <span className="text-base font-bold text-white block truncate">
              {registration.leaderName}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#24170F] border border-[rgba(252,135,6,0.20)] space-y-1">
            <span className="text-[11px] font-bold text-[#B8A99A] uppercase tracking-wider block">
              Domain / Track
            </span>
            <span className="text-base font-bold text-brand-orange block truncate">
              {registration.domain}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#24170F] border border-[rgba(252,135,6,0.20)] space-y-1">
            <span className="text-[11px] font-bold text-[#B8A99A] uppercase tracking-wider block">
              Membership Category
            </span>
            <span className="text-base font-bold text-brand-yellow block">
              {registration.membershipType}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#24170F] border border-[rgba(252,135,6,0.20)] space-y-1">
            <span className="text-[11px] font-bold text-[#B8A99A] uppercase tracking-wider block">
              Registration Fee
            </span>
            <span className="text-base font-mono font-bold text-white block">
              ₹{registration.registrationFee}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#24170F] border border-[rgba(252,135,6,0.20)] space-y-1">
            <span className="text-[11px] font-bold text-[#B8A99A] uppercase tracking-wider block">
              Institution / College
            </span>
            <span className="text-base font-bold text-white block truncate">
              {registration.leaderCollege || "MIT Academy of Engineering, Pune"}
            </span>
          </div>
        </div>

        {/* Project Title Callout */}
        <div className="p-5 rounded-2xl bg-[#24170F] border border-[rgba(252,135,6,0.20)] space-y-1">
          <span className="text-[11px] font-bold text-[#B8A99A] uppercase tracking-wider block">
            Project Title
          </span>
          <p className="text-base font-bold text-white leading-snug">
            {registration.projectTitle}
          </p>
        </div>

        {/* Additional Team Members if present */}
        {registration.teamMembers && registration.teamMembers.length > 0 && (
          <div className="p-5 rounded-2xl bg-[#24170F] border border-[rgba(252,135,6,0.20)] space-y-3">
            <span className="text-[11px] font-bold text-[#B8A99A] uppercase tracking-wider block">
              Team Members ({registration.teamMembers.length + 1} Total)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#17110D] border border-brand-border">
                <span className="text-brand-orange font-bold block">Leader: {registration.leaderName}</span>
                <span className="text-brand-muted text-[11px]">PRN: {registration.leaderPrn || "N/A"} • {registration.leaderEmail}</span>
              </div>
              {registration.teamMembers.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#17110D] border border-brand-border">
                  <span className="text-brand-white font-bold block">Member #{idx + 2}: {m.name}</span>
                  <span className="text-brand-muted text-[11px]">{m.email} {m.prn ? `• PRN: ${m.prn}` : ""}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[rgba(252,135,6,0.20)]">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-[#24170F] hover:bg-[#302016] text-[#FFF1DF] hover:text-white border border-[rgba(252,135,6,0.25)] text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Homepage
            </Link>
            <Link
              href="/technex-2k26"
              className="px-5 py-2.5 rounded-xl bg-[#24170F] hover:bg-[#302016] text-brand-yellow hover:text-white border border-[rgba(252,135,6,0.25)] text-xs font-bold flex items-center gap-2 transition-colors"
            >
              View TECHNEX Details
            </Link>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#24170F] hover:bg-[#302016] text-[#B8A99A] hover:text-white border border-[rgba(252,135,6,0.25)] text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save Confirmation
          </button>
        </div>
      </div>
    </div>
  );
}

// WhatsApp Icon SVG component
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

export default function RegistrationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-brand-secondary font-semibold">
            Loading registration details...
          </p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
