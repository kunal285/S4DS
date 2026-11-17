"use client";

import { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquare, ExternalLink } from "lucide-react";
import Toast from "@/components/Toast";

function WhatsAppIcon({ className = "w-4 h-4" }) {
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

let clientContactSettingsCache = null;
let clientContactSettingsTime = 0;

export default function ContactPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (clientContactSettingsCache && Date.now() - clientContactSettingsTime < 60000) {
      setSettings(clientContactSettingsCache);
      setLoading(false);
      return;
    }
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          clientContactSettingsCache = json.data;
          clientContactSettingsTime = Date.now();
          setSettings(json.data);
        }
      })
      .catch((err) => console.warn("Notice: Fetching contact settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setToast({ type: "success", message: "Thank you! Your message has been received." });
  };

  const whatsappUrl =
    settings?.technex?.whatsappUrl ||
    settings?.technexWhatsappUrl ||
    null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* ── Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-border text-xs font-bold text-brand-orange uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-brand-yellow" /> Get in Touch
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-brand-white tracking-tight">
          Connect with <span className="brand-text-gradient">{settings?.websiteName || "S4DS MITAOE"}</span>
        </h1>
        <p className="text-base sm:text-lg text-brand-secondary">
          Have queries about TECHNEX 2K26, student chapter membership, sponsorship opportunities, or workshop collaborations? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <h3 className="text-xl font-bold text-brand-white">Chapter Secretariat</h3>

            <div className="space-y-4 text-sm text-brand-secondary">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-white block">Campus Address:</strong>
                  {settings?.contactAddress || "MIT Academy of Engineering, Dehu Phata, Alandi (D), Pune, Maharashtra - 412105"}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-white block">Official Email:</strong>
                  {settings?.contactEmail || "s4ds.datascience@mitaoe.ac.in"}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-white block">Chapter Contact:</strong>
                  {settings?.about?.facultyCoordinator ? `${settings.about.facultyCoordinator} (${settings.contactPhone})` : (settings?.contactPhone || "+91 (020) 3025 3500")}
                </div>
              </div>

              {whatsappUrl && settings?.technexWhatsappEnabled !== false && (
                <div className="pt-2 border-t border-brand-border/60">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                    Join Official TECHNEX 2K26 WhatsApp Group
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-background-card border border-brand-border space-y-2 text-xs text-brand-muted">
            <h4 className="font-bold text-brand-white text-sm">Response Time SLA</h4>
            <p className="leading-relaxed">
              Our student executive council and faculty coordinators typically respond to all academic, technical, and event-related inquiries within 24 to 48 business hours.
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-10 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-brand-white border-b border-brand-border pb-4">
              Send us a Message
            </h3>

            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Thank you! Your message has been delivered to the S4DS secretariat.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                Subject / Topic *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Query regarding TECHNEX 2K26 Registration"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                Your Message *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Write your detailed inquiry or collaboration proposal here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl brand-btn text-white font-extrabold text-sm transition-transform hover:scale-[1.01] shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
