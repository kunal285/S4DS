"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Settings,
  Save,
  Sparkles,
  Globe,
  Home,
  Info,
  Phone,
  Bell,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Shield,
  Layers,
} from "lucide-react";
import Toast from "@/components/Toast";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [settings, setSettings] = useState({
    websiteName: "",
    websiteTagline: "",
    websiteDescription: "",
    logoUrl: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    contactCoordinates: "",
    footerText: "",
    copyrightText: "",
    socialLinks: {
      linkedin: "",
      github: "",
      instagram: "",
      twitter: "",
      discord: "",
      website: "",
    },
    homepage: {
      heroHeadline: "",
      heroTagline: "",
      heroDescription: "",
      heroBadgeText: "",
      roadmapHeading: "",
      roadmapSubheading: "",
    },
    about: {
      headline: "",
      story: "",
      mission: "",
      vision: "",
      facultyCoordinator: "",
      facultyDepartment: "",
      facultyCollege: "",
      facultyBio: "",
      values: [],
    },
    membership: {
      intakeBadge: "Cohort Admissions",
      intakeTitle: "Join Society for Data Science, MITAOE",
      intakeSchedule: "Intake Starts February 2027",
      intakeDescription: "",
      status: "Scheduled",
    },
    announcement: {
      enabled: true,
      text: "",
      link: "",
    },
    launchMode: false,
    pageAvailability: {
      home: true,
      technex: true,
      contact: true,
      about: true,
      events: true,
      team: true,
      gallery: true,
      projects: true,
      membership: true,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setSettings({
          websiteName: d.websiteName || "",
          websiteTagline: d.websiteTagline || "",
          websiteDescription: d.websiteDescription || "",
          logoUrl: d.logoUrl || "",
          contactEmail: d.contactEmail || "",
          contactPhone: d.contactPhone || "",
          contactAddress: d.contactAddress || "",
          contactCoordinates: d.contactCoordinates || "",
          footerText: d.footerText || "",
          copyrightText: d.copyrightText || "",
          socialLinks: {
            linkedin: d.socialLinks?.linkedin || "",
            github: d.socialLinks?.github || "",
            instagram: d.socialLinks?.instagram || "",
            twitter: d.socialLinks?.twitter || "",
            discord: d.socialLinks?.discord || "",
            website: d.socialLinks?.website || "",
          },
          homepage: {
            heroHeadline: d.homepage?.heroHeadline || "",
            heroTagline: d.homepage?.heroTagline || "",
            heroDescription: d.homepage?.heroDescription || "",
            heroBadgeText: d.homepage?.heroBadgeText || "",
            roadmapHeading: d.homepage?.roadmapHeading || "",
            roadmapSubheading: d.homepage?.roadmapSubheading || "",
          },
          about: {
            headline: d.about?.headline || "",
            story: d.about?.story || "",
            mission: d.about?.mission || "",
            vision: d.about?.vision || "",
            facultyCoordinator: d.about?.facultyCoordinator || "",
            facultyDepartment: d.about?.facultyDepartment || "",
            facultyCollege: d.about?.facultyCollege || "",
            facultyBio: d.about?.facultyBio || "",
            values: Array.isArray(d.about?.values) ? d.about.values : [],
          },
          membership: {
            intakeBadge: d.membership?.intakeBadge || "Cohort Admissions",
            intakeTitle: d.membership?.intakeTitle || "Join Society for Data Science, MITAOE",
            intakeSchedule: d.membership?.intakeSchedule || "Intake Starts February 2027",
            intakeDescription: d.membership?.intakeDescription || "",
            status: d.membership?.status || "Scheduled",
          },
          announcement: {
            enabled: d.announcement?.enabled !== false,
            text: d.announcement?.text || "",
            link: d.announcement?.link || "",
          },
          launchMode: d.launchMode === true,
          pageAvailability: {
            home: d.pageAvailability?.home !== false,
            technex: d.pageAvailability?.technex !== false,
            contact: d.pageAvailability?.contact !== false,
            about: d.pageAvailability?.about !== false,
            events: d.pageAvailability?.events !== false,
            team: d.pageAvailability?.team !== false,
            gallery: d.pageAvailability?.gallery !== false,
            projects: d.pageAvailability?.projects !== false,
            membership: d.pageAvailability?.membership !== false,
          },
        });
      }
    } catch {
      setToast({ type: "error", message: "Failed to load website settings from RushDB" });
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
        body: JSON.stringify(settings),
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

  const updateNested = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const updatePageAvail = (page, value) => {
    setSettings((prev) => ({
      ...prev,
      pageAvailability: {
        ...prev.pageAvailability,
        [page]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-brand-muted">Loading website settings from database...</p>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General & Branding", icon: Globe },
    { id: "homepage", label: "Homepage CMS", icon: Home },
    { id: "about", label: "About Chapter", icon: Info },
    { id: "contact", label: "Contact & Social", icon: Phone },
    { id: "membership", label: "Membership Hub", icon: Users },
    { id: "announcement", label: "Announcements", icon: Bell },
    { id: "availability", label: "Launch & Pages", icon: Layers },
  ];

  return (
    <div className="space-y-8">
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <h1 className="text-2xl font-black text-brand-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-brand-orange" /> Centralized Website Settings
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Configure all public website text, metadata, contact info, launch mode, and page availability stored in RushDB.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl brand-btn text-xs font-bold flex items-center gap-2 self-start shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving to RushDB..." : "Save Settings"}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-brand-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                active
                  ? "bg-brand-orange/20 text-brand-yellow border border-brand-orange/40 shadow-sm"
                  : "bg-background-card hover:bg-background-elevated text-brand-muted hover:text-white border border-brand-border"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── TAB 1: General & Branding ── */}
        {activeTab === "general" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-brand-white border-b border-brand-border pb-3">
              Chapter Identity &amp; Branding
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Website Title *</label>
                <input
                  type="text"
                  required
                  value={settings.websiteName}
                  onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                  placeholder="S4DS MITAOE"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Chapter Tagline *</label>
                <input
                  type="text"
                  required
                  value={settings.websiteTagline}
                  onChange={(e) => setSettings({ ...settings, websiteTagline: e.target.value })}
                  placeholder="Think. Analyze. Innovate."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Chapter Description *</label>
                <textarea
                  rows={3}
                  required
                  value={settings.websiteDescription}
                  onChange={(e) => setSettings({ ...settings, websiteDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Logo URL (or Supabase Storage URL) *</label>
                <input
                  type="text"
                  required
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="/images/logo.png"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange font-mono"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Footer Description Text</label>
                <textarea
                  rows={2}
                  value={settings.footerText}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Copyright Notice</label>
                <input
                  type="text"
                  value={settings.copyrightText}
                  onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                  placeholder="© {year} S4DS MITAOE Student Chapter. All rights reserved."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: Homepage CMS ── */}
        {activeTab === "homepage" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-brand-white border-b border-brand-border pb-3">
              Homepage Hero &amp; Roadmap Content
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Hero Badge Text</label>
                <input
                  type="text"
                  value={settings.homepage.heroBadgeText}
                  onChange={(e) => updateNested("homepage", "heroBadgeText", e.target.value)}
                  placeholder="Website Under Development • Launching Soon"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Hero Main Headline *</label>
                <input
                  type="text"
                  required
                  value={settings.homepage.heroHeadline}
                  onChange={(e) => updateNested("homepage", "heroHeadline", e.target.value)}
                  placeholder="Something Extraordinary Is Brewing."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Hero Tagline</label>
                <input
                  type="text"
                  value={settings.homepage.heroTagline}
                  onChange={(e) => updateNested("homepage", "heroTagline", e.target.value)}
                  placeholder="Think. Analyze. Innovate."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Hero Description Text *</label>
                <textarea
                  rows={4}
                  required
                  value={settings.homepage.heroDescription}
                  onChange={(e) => updateNested("homepage", "heroDescription", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Roadmap Heading</label>
                <input
                  type="text"
                  value={settings.homepage.roadmapHeading}
                  onChange={(e) => updateNested("homepage", "roadmapHeading", e.target.value)}
                  placeholder="What We're Building For You"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Roadmap Subheading</label>
                <input
                  type="text"
                  value={settings.homepage.roadmapSubheading}
                  onChange={(e) => updateNested("homepage", "roadmapSubheading", e.target.value)}
                  placeholder="Here is a sneak peek at what is arriving..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: About Chapter ── */}
        {activeTab === "about" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-brand-white border-b border-brand-border pb-3">
              About Chapter Mission, Vision &amp; Faculty Leadership
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">About Headline</label>
                <input
                  type="text"
                  value={settings.about.headline}
                  onChange={(e) => updateNested("about", "headline", e.target.value)}
                  placeholder="Pioneering Data Science & Artificial Intelligence Excellence"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Chapter Story / Background</label>
                <textarea
                  rows={4}
                  value={settings.about.story}
                  onChange={(e) => updateNested("about", "story", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Mission Statement</label>
                <textarea
                  rows={3}
                  value={settings.about.mission}
                  onChange={(e) => updateNested("about", "mission", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Vision Statement</label>
                <textarea
                  rows={3}
                  value={settings.about.vision}
                  onChange={(e) => updateNested("about", "vision", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Faculty Coordinator Name</label>
                <input
                  type="text"
                  value={settings.about.facultyCoordinator}
                  onChange={(e) => updateNested("about", "facultyCoordinator", e.target.value)}
                  placeholder="Prof. Aparna Kulkarni"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Department</label>
                <input
                  type="text"
                  value={settings.about.facultyDepartment}
                  onChange={(e) => updateNested("about", "facultyDepartment", e.target.value)}
                  placeholder="Department of Computer Engineering (Data Science)"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Faculty Coordinator Bio</label>
                <textarea
                  rows={2}
                  value={settings.about.facultyBio}
                  onChange={(e) => updateNested("about", "facultyBio", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>
            </div>

            {/* Core Values / Pillars */}
            <div className="space-y-3 pt-2 border-t border-brand-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Core Pillars / Values</label>
                <button
                  type="button"
                  onClick={() => {
                    const newValues = [...(settings.about.values || []), { title: "", desc: "" }];
                    updateNested("about", "values", newValues);
                  }}
                  className="text-xs px-3 py-1 rounded-lg bg-brand-orange/15 border border-brand-orange/40 text-brand-orange hover:bg-brand-orange/25 transition-colors"
                >
                  + Add Pillar
                </button>
              </div>
              {(settings.about.values || []).length === 0 && (
                <p className="text-xs text-brand-muted italic">No custom pillars defined — using system defaults.</p>
              )}
              {(settings.about.values || []).map((val, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-background-elevated border border-brand-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-orange">Pillar {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = settings.about.values.filter((_, i) => i !== idx);
                        updateNested("about", "values", updated);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={val.title}
                    onChange={(e) => {
                      const updated = settings.about.values.map((v, i) => i === idx ? { ...v, title: e.target.value } : v);
                      updateNested("about", "values", updated);
                    }}
                    placeholder="e.g. Hands-on Technical Rigor"
                    className="w-full px-3 py-2 rounded-lg bg-background-card border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                  <textarea
                    rows={2}
                    value={val.desc}
                    onChange={(e) => {
                      const updated = settings.about.values.map((v, i) => i === idx ? { ...v, desc: e.target.value } : v);
                      updateNested("about", "values", updated);
                    }}
                    placeholder="Short description of this pillar..."
                    className="w-full px-3 py-2 rounded-lg bg-background-card border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: Contact & Social ── */}
        {activeTab === "contact" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-brand-white border-b border-brand-border pb-3">
              Official Coordinates &amp; Social Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Chapter Email Address *</label>
                <input
                  type="email"
                  required
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="s4ds.datascience@mitaoe.ac.in"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Phone Number</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Full Campus Address *</label>
                <input
                  type="text"
                  required
                  value={settings.contactAddress}
                  onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                  placeholder="MIT Academy of Engineering, Dehu Phata, Alandi (D), Pune - 412105"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={settings.socialLinks.linkedin}
                  onChange={(e) => updateNested("socialLinks", "linkedin", e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">GitHub Organization URL</label>
                <input
                  type="url"
                  value={settings.socialLinks.github}
                  onChange={(e) => updateNested("socialLinks", "github", e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Instagram URL</label>
                <input
                  type="url"
                  value={settings.socialLinks.instagram}
                  onChange={(e) => updateNested("socialLinks", "instagram", e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Official College Website URL</label>
                <input
                  type="url"
                  value={settings.socialLinks.website}
                  onChange={(e) => updateNested("socialLinks", "website", e.target.value)}
                  placeholder="https://mitaoe.ac.in"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Membership Hub ── */}
        {activeTab === "membership" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-brand-white border-b border-brand-border pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-orange" /> Chapter Membership Portal CMS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Intake Badge</label>
                <input
                  type="text"
                  value={settings.membership?.intakeBadge || ""}
                  onChange={(e) => updateNested("membership", "intakeBadge", e.target.value)}
                  placeholder="Cohort Admissions"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Status Label</label>
                <select
                  value={settings.membership?.status || "Scheduled"}
                  onChange={(e) => updateNested("membership", "status", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Intake Title</label>
                <input
                  type="text"
                  value={settings.membership?.intakeTitle || ""}
                  onChange={(e) => updateNested("membership", "intakeTitle", e.target.value)}
                  placeholder="Join Society for Data Science, MITAOE"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Intake Schedule / Date Header</label>
                <input
                  type="text"
                  value={settings.membership?.intakeSchedule || ""}
                  onChange={(e) => updateNested("membership", "intakeSchedule", e.target.value)}
                  placeholder="Intake Starts February 2027"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-brand-secondary">Intake Description</label>
                <textarea
                  rows={3}
                  value={settings.membership?.intakeDescription || ""}
                  onChange={(e) => updateNested("membership", "intakeDescription", e.target.value)}
                  placeholder="Official enrollment for the S4DS student chapter cohort will launch soon..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: Announcements ── */}
        {activeTab === "announcement" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-brand-white border-b border-brand-border pb-3">
              Announcement Banner
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-background-elevated border border-brand-border">
                <input
                  type="checkbox"
                  id="announcementEnabled"
                  checked={settings.announcement.enabled}
                  onChange={(e) => updateNested("announcement", "enabled", e.target.checked)}
                  className="w-5 h-5 rounded text-brand-orange focus:ring-0 bg-background-card border-brand-border"
                />
                <label htmlFor="announcementEnabled" className="cursor-pointer">
                  <strong className="text-sm text-white block">Enable Announcement Banner</strong>
                  <span className="text-xs text-brand-muted">Display announcement notification across public site</span>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Banner Text</label>
                <input
                  type="text"
                  value={settings.announcement.text}
                  onChange={(e) => updateNested("announcement", "text", e.target.value)}
                  placeholder="🚀 Registrations are LIVE for TECHNEX 2K26!"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-secondary">Destination Link URL</label>
                <input
                  type="text"
                  value={settings.announcement.link}
                  onChange={(e) => updateNested("announcement", "link", e.target.value)}
                  placeholder="/technex-2k26"
                  className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: Launch Mode & Page Availability ── */}
        {activeTab === "availability" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-brand-white border-b border-brand-border pb-3">
              Website Launch Mode &amp; Page Availability Controls
            </h2>

            <div className="p-4 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 flex items-start gap-3">
              <Shield className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-brand-secondary">
                Control which pages are currently live vs. displaying the Under Development preview. As your committee finishes each section, simply toggle the switch to make it live instantly without code changes!
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: "home", label: "Homepage (/)" },
                { key: "technex", label: "TECHNEX 2K26 (/technex-2k26)" },
                { key: "contact", label: "Contact Us (/contact)" },
                { key: "about", label: "About Chapter (/about)" },
                { key: "events", label: "Events & Workshops (/events)" },
                { key: "team", label: "Our Core Team (/team)" },
                { key: "projects", label: "Student Projects (/projects)" },
                { key: "gallery", label: "Event Gallery (/gallery)" },
                { key: "membership", label: "Membership Hub (/membership)" },
              ].map((item) => {
                const isLive = Boolean(settings.pageAvailability[item.key]);
                return (
                  <div
                    key={item.key}
                    onClick={() => updatePageAvail(item.key, !isLive)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isLive
                        ? "bg-emerald-500/10 border-emerald-500/40"
                        : "bg-background-elevated border-brand-border hover:border-brand-orange/40"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">{item.label}</span>
                      <span className={`text-[10px] font-black uppercase tracking-wider block mt-0.5 ${
                        isLive ? "text-emerald-400" : "text-amber-400"
                      }`}>
                        {isLive ? "Live" : "Coming Soon"}
                      </span>
                    </div>

                    <div className={`p-1 rounded-full ${isLive ? "text-emerald-400" : "text-zinc-600"}`}>
                      {isLive ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl brand-btn text-white font-black text-sm shadow-xl shadow-brand-red/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving to RushDB..." : "Save Website Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
