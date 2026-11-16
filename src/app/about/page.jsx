import Link from "next/link";
import { isRouteLive } from "@/config/site-mode";
import UnderDevelopment from "@/components/UnderDevelopment";
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

export const metadata = {
  title: "About S4DS MITAOE | Society for Data Science Student Chapter",
  description:
    "Learn about the mission, vision, faculty leadership, and academic initiatives of the Society for Data Science (S4DS) at MIT Academy of Engineering, Alandi, Pune.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AboutPage() {
  if (!isRouteLive("/about")) {
    return <UnderDevelopment section="About Us" />;
  }
  const values = [
    {
      title: "Hands-on Technical Rigor",
      desc: "Moving beyond basic theory into production-ready deep learning, MLOps, LLMs, and enterprise distributed computing.",
      icon: Cpu,
    },
    {
      title: "Inclusive Student Community",
      desc: "Creating an open peer ecosystem where First Year students collaborate alongside final-year researchers and industry mentors.",
      icon: Users,
    },
    {
      title: "Applied Research & Publishing",
      desc: "Guiding students to write, review, and present technical research papers at national and international IEEE and Springer conferences.",
      icon: BookOpen,
    },
    {
      title: "Industry & Ecosystem Alignment",
      desc: "Partnering with tech enterprises to host project expos, real-world case study hackathons, and placement masterclasses.",
      icon: Compass,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* ── Heading ── */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-border text-xs font-bold text-brand-orange uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-brand-yellow" /> About Our Chapter
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-brand-white tracking-tight">
          Pioneering Data-Driven <span className="brand-text-gradient">Innovation</span> at MITAOE
        </h1>
        <p className="text-lg text-brand-secondary leading-relaxed font-normal">
          The Society for Data Science (S4DS) Student Chapter at MIT Academy of Engineering,
          Alandi (D), Pune, is dedicated to cultivating technical excellence, creative problem
          solving, and professional leadership in Computer Science and Data Science.
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
            To provide undergraduate engineering students with world-class technical exposure in Data
            Science, Machine Learning, Artificial Intelligence, and scalable software systems through
            experiential hackathons, industry-led masterclasses, and applied research challenges.
          </p>
          <ul className="space-y-3 pt-4 text-sm text-brand-secondary">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
              <span>Empower students with practical, deployable project experience</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
              <span>Bridge the curriculum gap with cutting-edge industry toolchains</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
              <span>Foster collaborative open-source contributions and publications</span>
            </li>
          </ul>
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
            To establish MITAOE as a nationally recognized hub for data-driven innovation, where student
            engineers create impactful technological solutions that address real-world socio-economic,
            industrial, and ecological challenges.
          </p>
          <ul className="space-y-3 pt-4 text-sm text-brand-secondary">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />
              <span>Annual national flagship events including TECHNEX 2K26 Expo</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />
              <span>Strong alumni mentorship, pre-incubators, and industry jury panels</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />
              <span>Holistic technical, ethical, and entrepreneurial leadership</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2 block">
            Guiding Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-white">
            What Drives Our Chapter
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-background-card border border-brand-border hover:border-brand-border-hover transition-all flex flex-col justify-between group shadow-md"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background-elevated border border-brand-border flex items-center justify-center mb-4 text-brand-orange group-hover:border-brand-orange transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-white mb-2 group-hover:text-brand-orange transition-colors">{v.title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Institution Affiliation ── */}
      <section className="p-8 sm:p-12 rounded-3xl bg-background-secondary border border-brand-border flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <GraduationCap className="w-4 h-4" /> Academic Affiliation
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-white">
            MIT Academy of Engineering (MITAOE)
          </h3>
          <p className="text-sm sm:text-base text-brand-secondary leading-relaxed">
            Established in 1999, MITAOE is an autonomous engineering institute affiliated with
            Savitribai Phule Pune University (SPPU) and accredited with NAAC &apos;A&apos; Grade. The
            Department of Computer Science and Engineering (Data Science) provides an inspiring
            platform for student research, patent filing, and national competitions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <Link
            href="/team"
            className="px-6 py-3 rounded-xl brand-btn text-brand-white font-bold text-sm transition-transform hover:scale-105 text-center shadow-lg shadow-brand-red/20"
          >
            Meet Faculty & Team
          </Link>
          <Link
            href="/technex-2k26"
            className="px-6 py-3 rounded-xl bg-background-card hover:bg-background-elevated text-brand-secondary hover:text-brand-white font-semibold text-sm transition-colors border border-brand-border text-center"
          >
            Explore TECHNEX 2K26
          </Link>
        </div>
      </section>
    </div>
  );
}
