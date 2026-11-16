"use client";

import Link from "next/link";
import { isRouteLive } from "@/config/site-mode";
import UnderDevelopment from "@/components/UnderDevelopment";
import {
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Calendar,
  Clock,
  Mail,
  GraduationCap,
  Flame,
  Award,
  Layers,
  HelpCircle,
} from "lucide-react";

export default function MembershipPage() {
  if (!isRouteLive("/membership")) {
    return <UnderDevelopment section="Membership Portal" />;
  }

  const benefits = [
    "Official S4DS National Student Member Certificate & Membership Kit",
    "Priority access & discounted entry to TECHNEX 2K26 Project Expo",
    "Closed-door masterclasses in Generative AI, LLMs, Computer Vision & MLOps",
    "Direct eligibility to join chapter technical committees & project teams",
    "Exclusive placement prep bootcamps, resume reviews & industry referrals",
  ];

  const eligibility = [
    "Open to all enrolled students of MIT Academy of Engineering (MITAOE), Alandi.",
    "Students across all engineering departments (Data Science, AI, Computer, IT, ENTC, Mechanical, Chemical, Civil).",
    "First Year, Second Year, Third Year, and Final Year B.Tech students are eligible.",
    "Passionate about Data Science, Machine Learning, Web Innovation, and Technical Leadership.",
  ];

  const domains = [
    { title: "Artificial Intelligence & ML", desc: "Deep Learning, PyTorch, LLMs, and Computer Vision" },
    { title: "Data Science & Analytics", desc: "Statistical modeling, Big Data pipelines, and BI visualization" },
    { title: "Web & Distributed Systems", desc: "Next.js, FastAPI, Cloud Architecture, and APIs" },
    { title: "Emerging Tech & Robotics", desc: "IoT, Edge AI devices, and autonomous platforms" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* ── Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-xs font-bold text-brand-orange uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-brand-yellow" /> Intake Starts February 2027
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-brand-white tracking-tight">
          Join <span className="brand-text-gradient">Society for Data Science</span>, MITAOE
        </h1>
        <p className="text-base sm:text-lg text-brand-secondary leading-relaxed">
          Official enrollment for the S4DS MITAOE Student Chapter cohort will officially launch in <strong className="text-brand-yellow font-bold">February 2027</strong>. Explore membership privileges, eligibility guidelines, and upcoming term roadmap below.
        </p>
      </div>

      {/* ── Main Showcase Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Benefits & Perks */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-xl">
            <h3 className="text-xl font-bold text-brand-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-orange" /> Exclusive Member Perks
            </h3>

            <ul className="space-y-4">
              {benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-brand-secondary leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Chapter Community & Culture */}
            <div className="p-5 rounded-2xl bg-background-elevated border border-brand-border space-y-3">
              <h4 className="text-sm font-bold text-brand-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-orange" /> Chapter Community &amp; Culture
              </h4>
              <p className="text-xs text-brand-secondary leading-relaxed">
                Joining S4DS MITAOE connects you directly with student mentors, faculty researchers, and industry alumni. Members gain hands-on collaboration opportunities across high-impact data initiatives, hackathons, and research projects.
              </p>
            </div>
          </div>

          {/* Technical Domains Card */}
          <div className="p-6 rounded-3xl bg-background-card border border-brand-border space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-brand-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-orange" /> Specialization Tracks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {domains.map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-background-elevated border border-brand-border space-y-1">
                  <span className="font-bold text-brand-white block">{d.title}</span>
                  <span className="text-[11px] text-brand-muted block">{d.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Admission Notice & Intake Schedule (No Input Form) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Official Announcement Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-background-card border-2 border-brand-orange/40 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-brand-border">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-orange/20 text-brand-yellow uppercase tracking-wider border border-brand-orange/40 inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-orange" /> Admissions Notice
                </span>
                <h3 className="text-2xl font-black text-brand-white">
                  Registrations Open in February 2027
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-background-elevated border border-brand-border text-brand-secondary text-xs font-mono font-bold self-start sm:self-auto">
                Status: Scheduled
              </span>
            </div>

            <p className="text-sm text-brand-secondary leading-relaxed">
              The online registration portal for new student memberships will officially open in <strong className="text-brand-yellow">February 2027</strong>. Student applications are currently closed while chapter activities focus on our flagship national event <strong className="text-brand-white">TECHNEX 2K26</strong>.
            </p>

            {/* Timeline Breakdown */}
            <div className="p-5 rounded-2xl bg-background-elevated border border-brand-orange/20 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-orange flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-yellow" /> Official Cohort Timeline
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-brand-border">
                  <span className="text-brand-muted">Registration Portal Launch:</span>
                  <span className="font-bold text-brand-yellow">February 2027</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-brand-border">
                  <span className="text-brand-muted">Chapter Orientation &amp; Induction:</span>
                  <span className="font-semibold text-brand-white">February 2027 (MITAOE Auditorium)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-brand-border">
                  <span className="text-brand-muted">Member Kit &amp; Certificate Allocation:</span>
                  <span className="font-semibold text-brand-white">February 2027</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-muted">Active Chapter Term:</span>
                  <span className="font-semibold text-brand-white">Academic Year 2027</span>
                </div>
              </div>
            </div>

            {/* Eligibility Guidelines */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-white flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-brand-orange" /> Who Can Join in February 2027?
              </h4>
              <ul className="space-y-2 text-xs text-brand-secondary">
                {eligibility.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-brand-orange font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions & Next Steps */}
            <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/technex-2k26"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl brand-btn text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-brand-red/30 transition-transform hover:scale-105"
              >
                <Flame className="w-4 h-4" /> Register for TECHNEX 2K26 Expo
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-background-elevated hover:bg-background-secondary border border-brand-border text-brand-secondary hover:text-brand-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-orange" /> Contact Chapter Coordinator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
