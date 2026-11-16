"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquare } from "lucide-react";
import Toast from "@/components/Toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setToast({ type: "success", message: "Thank you! Your message has been received." });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* ── Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-border text-xs font-bold text-brand-orange uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-brand-yellow" /> Get in Touch
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-brand-white tracking-tight">
          Connect with <span className="brand-text-gradient">S4DS MITAOE</span>
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
                  MIT Academy of Engineering, Dehu Phata, Alandi (D), Pune, Maharashtra - 412105
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-white block">Official Email:</strong>
                  {process.env.NEXT_PUBLIC_CHAPTER_EMAIL || "s4ds.datascience@mitaoe.ac.in"}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-white block">Faculty Coordinator:</strong>
                  Prof. Aparna Kulkarni ({process.env.NEXT_PUBLIC_CHAPTER_PHONE || "+91 (020) 3025 3500"})
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-background-elevated border border-brand-border space-y-2 text-xs text-brand-muted">
              <strong className="text-brand-secondary block">Student Help Desk:</strong>
              Available Monday through Saturday, 9:00 AM to 5:00 PM IST in the Department of Computer Science and Engineering (Data Science).
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-background-card border border-brand-border shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center mx-auto text-brand-orange">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-white">Message Dispatched!</h3>
                <p className="text-sm text-brand-secondary max-w-sm mx-auto">
                  Our student coordinators will review your inquiry and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-background-elevated hover:bg-background-secondary border border-brand-border text-brand-white text-xs font-semibold transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-2xl font-bold text-brand-white mb-2">Send an Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Deshmukh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="priya@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="TECHNEX Registration / Sponsorship / Membership query"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our chapter team assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl brand-btn text-brand-white font-extrabold text-sm shadow-xl shadow-brand-red/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
