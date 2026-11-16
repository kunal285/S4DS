import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Flame,
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Construction,
  MessageSquare,
  Users,
  Layers,
  Brain,
  Database,
  Award,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "S4DS MITAOE | Something Extraordinary Is Brewing",
  description:
    "We're building a digital home for curious minds, data enthusiasts and future innovators. Our new website is currently under development. Stay connected with S4DS MITAOE.",
  openGraph: {
    title: "S4DS MITAOE | Think. Analyze. Innovate.",
    description:
      "We're building a digital home for curious minds, data enthusiasts and future innovators. Stay connected with S4DS MITAOE.",
    images: ["/images/logo.png"],
  },
};

export default function HomePage() {
  return (
    <div className="relative min-h-[90vh] overflow-hidden bg-background-main text-brand-white">
      {/* ── AMBIENT GRADIENT BACKDROPS ── */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#EC3507]/15 via-[#FC8706]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-[#FDB006]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-10 w-96 h-96 bg-[#EC3507]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
        {/* ── HERO COMING-SOON SECTION ── */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo with Glow Ring */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#EC3507] via-[#FC8706] to-[#FDB006] blur-2xl opacity-40 animate-pulse" />
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-background-card border-2 border-brand-orange/40 p-3 shadow-2xl flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="S4DS MITAOE Official Logo"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Under Development Pill */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-background-card border border-brand-orange/35 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow animate-ping" />
              <Construction className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-yellow">
                Website Under Development • Launching Soon
              </span>
            </div>
          </div>

          {/* Tagline & Headlines */}
          <div className="space-y-4">
            <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-brand-orange">
              Think. Analyze. Innovate.
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-brand-white tracking-tight leading-tight">
              Something Extraordinary <br />
              <span className="brand-text-gradient">Is Brewing.</span>
            </h1>

            <p className="text-base sm:text-lg text-brand-secondary max-w-2xl mx-auto leading-relaxed pt-2">
              We&apos;re building a digital home for curious minds, data enthusiasts and future innovators. Our new website is currently under development. Stay connected with S4DS MITAOE.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/technex-2k26"
              className="px-8 py-4 rounded-2xl brand-btn text-white text-sm sm:text-base font-black flex items-center gap-3 shadow-xl shadow-brand-red/30 transition-transform hover:scale-105 active:scale-95"
            >
              <Flame className="w-5 h-5 text-brand-yellow" />
              Register for TECHNEX 2K26
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="px-8 py-4 rounded-2xl bg-background-card hover:bg-background-elevated text-brand-white border border-brand-border text-sm sm:text-base font-bold flex items-center gap-2 transition-all hover:border-brand-orange shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-brand-orange" />
              Contact S4DS Chapter
            </Link>
          </div>
        </div>

        {/* ── FEATURED FLAGSHIP EVENT: TECHNEX 2K26 ── */}
        <div className="relative rounded-3xl bg-gradient-to-br from-background-card via-[#1e140e] to-background-card border-2 border-brand-orange/40 p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Registrations Actively Live
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  TECHNEX 2K26 <span className="brand-text-gradient">– National Project Expo</span>
                </h2>
                <p className="text-sm sm:text-base text-brand-secondary leading-relaxed max-w-2xl">
                  The flagship benchmark project exhibition of MIT Academy of Engineering. Present your working hardware and software prototypes, interact with venture mentors, and compete with talent nationwide.
                </p>
              </div>

              {/* Event Metadata Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-background-elevated border border-brand-border">
                  <span className="text-[10px] uppercase font-bold text-brand-muted block">Expo Date</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4 text-brand-yellow" /> Nov 21, 2026
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-background-elevated border border-brand-border">
                  <span className="text-[10px] uppercase font-bold text-brand-muted block">Venue</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-brand-orange" /> MITAOE Pune
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-background-elevated border border-brand-border">
                  <span className="text-[10px] uppercase font-bold text-brand-muted block">Registration Fee</span>
                  <span className="text-sm font-bold text-brand-yellow flex items-center gap-1.5 mt-0.5">
                    <Award className="w-4 h-4 text-brand-yellow" /> ₹49 (S4DS) / ₹99 (General)
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/technex-2k26"
                  className="px-6 py-3 rounded-xl brand-btn text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg"
                >
                  Enter Project Expo Portal &rarr;
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-background-elevated hover:bg-background-card text-brand-secondary hover:text-white border border-brand-border text-xs sm:text-sm font-semibold transition-colors"
                >
                  Ask Event Coordinators
                </Link>
              </div>
            </div>

            {/* Poster Thumbnail */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 sm:w-72 aspect-[4/5] rounded-2xl overflow-hidden border-2 border-brand-orange/40 shadow-2xl bg-background-card">
                <Image
                  src="/images/technex-poster.png"
                  alt="TECHNEX 2K26 Official Expo Poster"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── COMING SOON SECTIONS PREVIEW ── */}
        <div className="space-y-8 text-center">
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
              Roadmap &amp; Evolution
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              What We&apos;re Building For You
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted">
              Here is a sneak peek at what is arriving with the official S4DS MITAOE complete web platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Workshops & Hackathons",
                tag: "Coming Soon",
                desc: "Hands-on masterclasses in Generative AI, PyTorch, BigQuery, and full-stack data apps.",
                icon: Database,
              },
              {
                title: "Executive Team & Faculty",
                tag: "Coming Soon",
                desc: "Meet our student core team, faculty mentors, and advisory board driving chapter initiatives.",
                icon: Users,
              },
              {
                title: "Annual Event Gallery",
                tag: "Coming Soon",
                desc: "Curated high-resolution archives of campus exhibitions, speaker sessions, and project showcases.",
                icon: Layers,
              },
              {
                title: "Chapter Membership Hub",
                tag: "Coming Soon",
                desc: "Exclusive member benefits, discount passes, community discord, and technical certification track.",
                icon: Sparkles,
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-background-card border border-brand-border space-y-3 text-left relative overflow-hidden group hover:border-brand-orange/50 transition-colors shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-background-elevated border border-brand-border flex items-center justify-center text-brand-orange">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-orange/15 text-brand-yellow border border-brand-orange/30 uppercase tracking-wider">
                      {card.tag}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-brand-yellow transition-colors">
                    {card.title}
                  </h4>

                  <p className="text-xs text-brand-muted leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CHAPTER CREDENTIALS STRIP ── */}
        <div className="p-6 rounded-2xl bg-background-card border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-background-elevated border border-brand-border p-0.5 shrink-0">
              <Image src="/images/logo.png" alt="S4DS" fill className="object-contain" />
            </div>
            <div>
              <strong className="text-white block font-bold">Society for Data Science (S4DS)</strong>
              <span>MIT Academy of Engineering, Dehu Phata, Alandi (D), Pune - 412105</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="text-brand-orange hover:text-brand-yellow font-bold underline transition-colors"
            >
              Contact Secretariat
            </Link>
            <span className="text-brand-border">•</span>
            <Link
              href="/technex-2k26"
              className="text-brand-yellow hover:text-white font-bold transition-colors"
            >
              TECHNEX 2K26 &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
