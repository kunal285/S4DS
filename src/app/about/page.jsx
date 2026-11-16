import Link from "next/link";
import { isRouteLive } from "@/config/site-mode";
import UnderDevelopment from "@/components/UnderDevelopment";
import { getSettings } from "@/lib/db";
import {
  CheckCircle2,
  BookOpen,
  Compass,
  Cpu,
  GraduationCap,
  Sparkles,
  Users,
  Target,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";


export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: `About ${settings.websiteName || "S4DS MITAOE"} | Society for Data Science Student Chapter`,
    description: settings.about?.story || settings.websiteDescription,
  };
}

export default async function AboutPage() {
  if (!(await isRouteLive("/about"))) {
    return <UnderDevelopment section="About Us" />;
  }

  const settings = await getSettings();
  const about = settings.about || {};

  const VALUE_ICONS = [Cpu, Users, BookOpen, Compass];
  const DEFAULT_VALUES = [
    {
      title: "Hands-on Technical Rigor",
      desc: "Moving beyond basic theory into production-ready deep learning, MLOps, LLMs, and enterprise distributed computing.",
    },
    {
      title: "Inclusive Student Community",
      desc: "Creating an open peer ecosystem where First Year students collaborate alongside final-year researchers and industry mentors.",
    },
    {
      title: "Applied Research & Publishing",
      desc: "Guiding students to write, review, and present technical research papers at national and international conferences.",
    },
    {
      title: "Industry & Ecosystem Alignment",
      desc: "Partnering with tech enterprises to host project expos, real-world case study hackathons, and placement masterclasses.",
    },
  ];
  const rawValues = about.values?.length ? about.values : DEFAULT_VALUES;
  const values = rawValues.map((v, i) => ({ ...v, icon: VALUE_ICONS[i % VALUE_ICONS.length] }));

  const stats = about.stats || [
    { label: "Active Members", value: "250+" },
    { label: "Workshops & Seminars", value: "35+" },
    { label: "Hackathons & Challenges", value: "12+" },
    { label: "Projects Incubated", value: "40+" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* ── Heading ── */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-border text-xs font-bold text-brand-orange uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-brand-yellow" /> About Our Chapter
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-brand-white tracking-tight">
          {about.headline || "Pioneering Data-Driven Innovation"}
        </h1>
        <p className="text-lg text-brand-secondary leading-relaxed font-normal">
          {about.story || settings.websiteDescription}
        </p>
      </section>

      {/* ── Mission & Vision Bento ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-background-card border border-brand-border space-y-5 shadow-xl hover:border-brand-border-hover transition-all">
          <div className="w-12 h-12 rounded-xl bg-background-elevated border border-brand-border flex items-center justify-center text-brand-orange font-bold text-xl">
            01
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-white flex items-center gap-3">
            <Target className="w-7 h-7 text-brand-orange" />
            Our Mission
          </h2>
          <p className="text-brand-secondary leading-relaxed text-base">
            {about.mission || "To empower students with deep theoretical understanding and production-grade hands-on engineering skills in data science, artificial intelligence, and cutting-edge software engineering."}
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-background-card border border-brand-border space-y-5 shadow-xl hover:border-brand-border-hover transition-all">
          <div className="w-12 h-12 rounded-xl bg-background-elevated border border-brand-border flex items-center justify-center text-brand-yellow font-bold text-xl">
            02
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-brand-yellow" />
            Our Vision
          </h2>
          <p className="text-brand-secondary leading-relaxed text-base">
            {about.vision || "To be a premier student-led hub producing world-class data scientists, researchers, and innovators who solve impactful real-world challenges."}
          </p>
        </div>
      </section>

      {/* ── Key Values ── */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-brand-white">Our Core Pillars</h2>
          <p className="text-brand-muted text-sm">
            Four guiding cornerstones behind every hackathon, workshop, and chapter milestone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-background-card border border-brand-border hover:border-brand-orange/40 transition-all space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-background-elevated border border-brand-border flex items-center justify-center text-brand-orange">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-brand-white">{v.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Faculty Coordinator Spotlight ── */}
      {about.facultyCoordinator && (
        <section className="p-8 sm:p-12 rounded-3xl bg-background-card border border-brand-border flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <div className="w-20 h-20 rounded-2xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange shrink-0">
            <GraduationCap className="w-10 h-10" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider block">
              Faculty Coordination &amp; Mentorship
            </span>
            <h3 className="text-2xl font-black text-brand-white">
              {about.facultyCoordinator}
            </h3>
            <p className="text-xs font-semibold text-brand-yellow">
              {about.facultyDepartment || "Department of Computer Engineering (Data Science)"} • {about.facultyCollege || "MIT Academy of Engineering"}
            </p>
            <p className="text-xs text-brand-secondary leading-relaxed pt-1">
              {about.facultyBio || "Guiding the S4DS student chapter, fostering research innovation, and mentoring collegiate talent."}
            </p>
          </div>
        </section>
      )}

      {/* ── Stats Strip ── */}
      <section className="p-8 rounded-3xl bg-background-card border border-brand-border grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, idx) => (
          <div key={idx} className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-brand-yellow font-mono">{s.value}</div>
            <div className="text-xs text-brand-muted uppercase font-semibold">{s.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
