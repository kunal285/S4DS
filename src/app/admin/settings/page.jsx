"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link2,
  Eye,
  Check,
} from "lucide-react";
import Toast from "@/components/Toast";

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

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [technexWhatsappUrl, setTechnexWhatsappUrl] = useState("");
  const [technexWhatsappEnabled, setTechnexWhatsappEnabled] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success && json.data) {
        setTechnexWhatsappUrl(json.data.technexWhatsappUrl || "");
        setTechnexWhatsappEnabled(json.data.technexWhatsappEnabled !== false);
      }
    } catch {
      setToast({ type: "error", message: "Failed to load website settings" });
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
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          technexWhatsappUrl: technexWhatsappUrl.trim(),
          technexWhatsappEnabled: Boolean(technexWhatsappEnabled),
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setToast({ type: "success", message: "Settings saved successfully to RushDB!" });
      } else {
        setToast({ type: "error", message: json.error || "Failed to save settings" });
      }
    } catch {
      setToast({ type: "error", message: "Network error while saving settings" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" /> Global Website Controls
        </div>
        <h1 className="text-3xl font-black text-brand-white">Website & Event Settings</h1>
        <p className="text-xs text-brand-secondary mt-1">
          Configure external communication channels, TECHNEX participant links, and chapter settings.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-brand-muted rounded-2xl bg-background-card border border-brand-border">
          Loading settings from RushDB...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* ── TECHNEX 2K26 WhatsApp Configuration Card ── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-white">
                    TECHNEX 2K26 – WhatsApp Group Integration
                  </h3>
                  <p className="text-xs text-brand-muted">
                    Participants will see this link on the registration success page immediately after submitting.
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    technexWhatsappEnabled && technexWhatsappUrl
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      technexWhatsappEnabled && technexWhatsappUrl ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  {technexWhatsappEnabled && technexWhatsappUrl ? "Active & Visible" : "Disabled / Inactive"}
                </span>
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-secondary flex items-center gap-2">
                <Link2 className="w-4 h-4 text-brand-orange" />
                Official WhatsApp Group Invitation URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://chat.whatsapp.com/..."
                  value={technexWhatsappUrl}
                  onChange={(e) => setTechnexWhatsappUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background-elevated border border-brand-border text-brand-white placeholder-brand-muted text-sm focus:outline-none focus:border-brand-orange font-mono"
                />
              </div>
              <p className="text-[11px] text-brand-muted">
                Paste the invite link directly from WhatsApp Group Settings → &quot;Invite via link&quot;.
              </p>
            </div>

            {/* Toggle Enable/Disable */}
            <div className="p-4 rounded-2xl bg-background-elevated border border-brand-border flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-white block">
                  Enable WhatsApp Invitation on Success Page
                </span>
                <span className="text-[11px] text-brand-muted block mt-0.5">
                  When enabled, registered teams will see the &quot;JOIN OFFICIAL WHATSAPP GROUP&quot; button on /registration/success.
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={technexWhatsappEnabled}
                  onChange={(e) => setTechnexWhatsappEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-background-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 border border-brand-border"></div>
              </label>
            </div>

            {/* Preview Section */}
            {technexWhatsappUrl && (
              <div className="p-4 rounded-2xl bg-background-elevated/70 border border-brand-border space-y-3">
                <span className="text-xs font-bold text-brand-secondary flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brand-yellow" /> Button Preview on Success Page:
                </span>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href={technexWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                    JOIN OFFICIAL WHATSAPP GROUP
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <span className="text-[11px] text-brand-muted italic">
                    Click to test link in a new tab
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl brand-btn text-white text-xs font-bold flex items-center gap-2 shadow-xl shadow-brand-red/25 transition-transform hover:scale-105 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving to RushDB..." : "Save Settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
