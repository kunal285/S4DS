"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Flame,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link2,
  Calendar,
  MapPin,
  Clock,
  Users,
  CreditCard,
  Plus,
  Trash2,
  Upload,
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

export default function AdminTechnexPage() {
  const [config, setConfig] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    title: "",
    tagline: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    mode: "Offline / In-Person",
    minTeamSize: 1,
    maxTeamSize: 4,
    registrationOpen: true,
    registrationDeadline: "",
    whatsappUrl: "",
    whatsappEnabled: true,
    paymentInstructions: "",
    upiId: "9172106568@airtel",
    upiPayeeName: "S4DS MITAOE",
    activePaymentQrId: "",
    activePaymentQrUrl: "",
    posterUrl: "",
    posterMediaId: "",
    membershipTiers: [],
    domains: [],
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [resConfig, resMedia] = await Promise.all([
        fetch("/api/technex/config"),
        fetch("/api/media"),
      ]);

      const jsonConfig = await resConfig.json();
      const jsonMedia = await resMedia.json();

      if (jsonConfig.success && jsonConfig.data) {
        setConfig(jsonConfig.data);
        setForm({
          title: jsonConfig.data.title || "",
          tagline: jsonConfig.data.tagline || "",
          description: jsonConfig.data.description || "",
          date: jsonConfig.data.date || "",
          time: jsonConfig.data.time || "",
          venue: jsonConfig.data.venue || "",
          mode: jsonConfig.data.mode || "Offline / In-Person",
          minTeamSize: jsonConfig.data.minTeamSize || 1,
          maxTeamSize: jsonConfig.data.maxTeamSize || 4,
          registrationOpen: jsonConfig.data.registrationOpen !== false,
          registrationDeadline: jsonConfig.data.registrationDeadline || "",
          whatsappUrl: jsonConfig.data.whatsappUrl || "",
          whatsappEnabled: jsonConfig.data.whatsappEnabled !== false,
          paymentInstructions: jsonConfig.data.paymentInstructions || "",
          upiId: jsonConfig.data.upiId || "9172106568@airtel",
          upiPayeeName: jsonConfig.data.upiPayeeName || "S4DS MITAOE",
          activePaymentQrId: jsonConfig.data.activePaymentQrId || "",
          activePaymentQrUrl: jsonConfig.data.activePaymentQrUrl || "",
          posterUrl: jsonConfig.data.posterUrl || "",
          posterMediaId: jsonConfig.data.posterMediaId || "",
          membershipTiers: jsonConfig.data.membershipTiers || [],
          domains: jsonConfig.data.domains || [],
        });
      }

      if (jsonMedia.success && jsonMedia.data) {
        setMediaList(jsonMedia.data);
      }
    } catch {
      setToast({ type: "error", message: "Failed to load TECHNEX configuration" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem("s4ds_admin_token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const res = await fetch("/api/technex/config", {
        method: "PATCH",
        headers,
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setToast({ type: "success", message: "TECHNEX configuration saved successfully in RushDB!" });
      } else {
        setToast({ type: "error", message: json.error || "Failed to save configuration" });
      }
    } catch {
      setToast({ type: "error", message: "Network error while saving configuration" });
    } finally {
      setSaving(false);
    }
  };

  // Membership Tier Handlers
  const handleTierChange = (index, field, value) => {
    const updated = [...form.membershipTiers];
    updated[index][field] = field === "fee" ? Number(value) : value;
    setForm({ ...form, membershipTiers: updated });
  };

  const addTier = () => {
    setForm({
      ...form,
      membershipTiers: [
        ...form.membershipTiers,
        { id: `tier-${Date.now()}`, name: "New Tier", fee: 99, description: "Category description" },
      ],
    });
  };

  const removeTier = (index) => {
    setForm({
      ...form,
      membershipTiers: form.membershipTiers.filter((_, i) => i !== index),
    });
  };

  // Domain Tracks Handlers
  const handleDomainChange = (index, value) => {
    const updated = [...form.domains];
    updated[index] = value;
    setForm({ ...form, domains: updated });
  };

  const addDomain = () => {
    setForm({
      ...form,
      domains: [...form.domains, "New Competition Track"],
    });
  };

  const removeDomain = (index) => {
    setForm({
      ...form,
      domains: form.domains.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-brand-muted">Loading TECHNEX configuration from database...</p>
      </div>
    );
  }

  const qrMediaOptions = mediaList.filter((m) => m.category === "payment-qr");
  const posterMediaOptions = mediaList.filter((m) => m.category === "event-poster");

  return (
    <div className="space-y-8">
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <h1 className="text-2xl font-black text-brand-white flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-brand-orange" /> TECHNEX 2K26 Configuration CMS
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Centrally manage TECHNEX event details, membership fees, domains, QR code, and registration availability stored in RushDB.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl brand-btn text-xs font-bold flex items-center gap-2 self-start shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving to RushDB..." : "Save All Changes"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* ── 1. Event Details & Timing ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
          <h2 className="text-lg font-black text-brand-white flex items-center gap-2 border-b border-brand-border pb-3">
            <Sparkles className="w-5 h-5 text-brand-yellow" /> 1. Event Overview &amp; Venue
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-brand-secondary">Event Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-sm text-white focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-brand-secondary">Event Tagline / Subtitle</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-sm text-white focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-brand-secondary">Description *</label>
              <textarea
                rows={4}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-sm text-white focus:outline-none focus:border-brand-orange resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-secondary">Event Date *</label>
              <input
                type="text"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="e.g. 2026-11-21 or Nov 21, 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-sm text-white focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-secondary">Event Timing *</label>
              <input
                type="text"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="e.g. 09:00 AM - 05:00 PM IST"
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-sm text-white focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-secondary">Venue / Campus Location *</label>
              <input
                type="text"
                required
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                placeholder="e.g. MIT Academy of Engineering, Alandi, Pune"
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-sm text-white focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-secondary">Event Mode / Format</label>
              <input
                type="text"
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
                placeholder="Offline / In-Person"
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-sm text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* ── 2. Registration Availability & Team Sizing ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
          <h2 className="text-lg font-black text-brand-white flex items-center gap-2 border-b border-brand-border pb-3">
            <Users className="w-5 h-5 text-brand-orange" /> 2. Registration Availability &amp; Team Limits
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-background-elevated border border-brand-border">
              <input
                type="checkbox"
                id="registrationOpen"
                checked={form.registrationOpen}
                onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })}
                className="w-5 h-5 rounded text-brand-orange focus:ring-0 bg-background-card border-brand-border"
              />
              <label htmlFor="registrationOpen" className="cursor-pointer">
                <strong className="text-sm text-white block">Registrations Open</strong>
                <span className="text-xs text-brand-muted">Allow students to submit registrations</span>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-secondary">Min Team Size</label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.minTeamSize}
                onChange={(e) => setForm({ ...form, minTeamSize: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-sm text-white focus:outline-none focus:border-brand-orange font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-secondary">Max Team Size</label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.maxTeamSize}
                onChange={(e) => setForm({ ...form, maxTeamSize: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-sm text-white focus:outline-none focus:border-brand-orange font-mono"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold text-brand-secondary">Registration Deadline (ISO timestamp or Date)</label>
              <input
                type="text"
                value={form.registrationDeadline}
                onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })}
                placeholder="2026-11-25T23:59:59"
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-sm text-white focus:outline-none focus:border-brand-orange font-mono"
              />
            </div>
          </div>
        </div>

        {/* ── 3. Dynamic Membership Tiers & Registration Fees ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h2 className="text-lg font-black text-brand-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-yellow" /> 3. Membership Categories &amp; Registration Fees
            </h2>
            <button
              type="button"
              onClick={addTier}
              className="px-3 py-1.5 rounded-xl bg-background-elevated hover:bg-background-secondary border border-brand-border text-xs font-bold text-brand-orange hover:text-brand-yellow flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tier
            </button>
          </div>

          <p className="text-xs text-brand-muted">
            Configure the membership categories and their exact fees. The registration form and server validation use these exact database values.
          </p>

          <div className="space-y-4">
            {form.membershipTiers.map((tier, idx) => (
              <div
                key={tier.id || idx}
                className="p-4 rounded-2xl bg-background-elevated border border-brand-border grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
              >
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={tier.name}
                    onChange={(e) => handleTierChange(idx, "name", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background-card border border-brand-border text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                    Fee (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={tier.fee}
                    onChange={(e) => handleTierChange(idx, "fee", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background-card border border-brand-border text-xs text-brand-yellow font-bold font-mono"
                  />
                </div>

                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                    Description / Eligibility
                  </label>
                  <input
                    type="text"
                    value={tier.description || ""}
                    onChange={(e) => handleTierChange(idx, "description", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background-card border border-brand-border text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeTier(idx)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    title="Remove Tier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Competition Tracks / Domains ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h2 className="text-lg font-black text-brand-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-orange" /> 4. Competition Tracks / Domains
            </h2>
            <button
              type="button"
              onClick={addDomain}
              className="px-3 py-1.5 rounded-xl bg-background-elevated hover:bg-background-secondary border border-brand-border text-xs font-bold text-brand-orange hover:text-brand-yellow flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Track
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {form.domains.map((dom, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-background-elevated border border-brand-border"
              >
                <span className="w-7 h-7 rounded-lg bg-background-card border border-brand-border flex items-center justify-center text-xs font-bold text-brand-orange shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  required
                  value={dom}
                  onChange={(e) => handleDomainChange(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-background-card border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
                <button
                  type="button"
                  onClick={() => removeDomain(idx)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Payment QR & Instructions ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
          <h2 className="text-lg font-black text-brand-white flex items-center gap-2 border-b border-brand-border pb-3">
            <CreditCard className="w-5 h-5 text-brand-yellow" /> 5. Payment Instructions &amp; Payment QR Code
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-secondary">Official UPI ID (VPA) *</label>
                  <input
                    type="text"
                    required
                    value={form.upiId}
                    onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                    placeholder="e.g. 9172106568@airtel"
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-secondary">UPI Payee Display Name</label>
                  <input
                    type="text"
                    value={form.upiPayeeName}
                    onChange={(e) => setForm({ ...form, upiPayeeName: e.target.value })}
                    placeholder="e.g. S4DS MITAOE"
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Payment Instructions Text *</label>
                <textarea
                  rows={5}
                  required
                  value={form.paymentInstructions}
                  onChange={(e) => setForm({ ...form, paymentInstructions: e.target.value })}
                  placeholder="Step by step instructions for participants..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">
                  Active Payment QR Reference (From Media Library / Supabase)
                </label>
                <select
                  value={form.activePaymentQrId}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const item = mediaList.find((m) => m.id === selId);
                    setForm({
                      ...form,
                      activePaymentQrId: selId,
                      activePaymentQrUrl: item ? item.fileUrl : form.activePaymentQrUrl,
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                >
                  <option value="">Select from Media Library QR codes...</option>
                  {qrMediaOptions.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.fileName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Direct Payment QR Image URL</label>
                <input
                  type="text"
                  value={form.activePaymentQrUrl}
                  onChange={(e) => setForm({ ...form, activePaymentQrUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/.../payment-qr.png"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange font-mono"
                />
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-background-elevated border border-brand-border space-y-2">
              <span className="text-[10px] font-bold text-brand-muted uppercase">Active QR Preview</span>
              <div className="relative w-44 h-44 rounded-xl overflow-hidden border border-brand-orange/40 bg-white p-2">
                {form.activePaymentQrUrl ? (
                  <Image
                    src={form.activePaymentQrUrl}
                    alt="Active QR"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500">
                    No QR Selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. Official WhatsApp Channel & Event Poster ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
          <h2 className="text-lg font-black text-brand-white flex items-center gap-2 border-b border-brand-border pb-3">
            <WhatsAppIcon className="w-5 h-5 text-emerald-400" /> 6. Official WhatsApp Group &amp; Event Poster
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Official WhatsApp Group Invitation URL *</label>
                <input
                  type="url"
                  required
                  value={form.whatsappUrl}
                  onChange={(e) => setForm({ ...form, whatsappUrl: e.target.value })}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-background-elevated border border-brand-border">
                <input
                  type="checkbox"
                  id="whatsappEnabled"
                  checked={form.whatsappEnabled}
                  onChange={(e) => setForm({ ...form, whatsappEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-orange focus:ring-0 bg-background-card border-brand-border"
                />
                <label htmlFor="whatsappEnabled" className="cursor-pointer text-xs text-white font-semibold">
                  Display WhatsApp Group Banner on Website
                </label>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-brand-secondary">Event Poster URL (Cloudinary Storage)</label>
                <input
                  type="text"
                  value={form.posterUrl}
                  onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/.../poster.png"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-background-elevated border border-brand-border space-y-2">
              <span className="text-[10px] font-bold text-brand-muted uppercase">Poster Preview</span>
              <div className="relative w-44 aspect-[4/5] rounded-xl overflow-hidden border border-brand-orange/40 bg-black/40">
                {form.posterUrl ? (
                  <Image
                    src={form.posterUrl}
                    alt="Poster Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500">
                    No Poster Selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Final Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl brand-btn text-white font-black text-sm shadow-xl shadow-brand-red/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving to RushDB..." : "Save TECHNEX Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
