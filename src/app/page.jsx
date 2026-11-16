import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Users,
  Award,
  ChevronRight,
  Flame,
  Zap,
  Cpu,
  Brain,
  Database,
  BarChart3,
  Globe2,
  Layers,
  CheckCircle2,
  MapPin,
  Clock,
} from "lucide-react";
import { getEvents, getTeamMembers, getGalleryItems } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [events, teamMembers, galleryItems] = await Promise.all([
    getEvents(),
    getTeamMembers(),
    getGalleryItems(),
  ]);

  const upcomingEvents = events.filter((e) => e.status === "Upcoming").slice(0, 3);
  const coreTeam = teamMembers.slice(0, 4);
  const galleryPreview = galleryItems.slice(0, 3);

  const stats = [
    { label: "Active Student Members", value: "350+", icon: Users },
    { label: "Technical Workshops", value: "24+", icon: Calendar },
    { label: "Technical Domains", value: "6+", icon: Layers },
    { label: "Student Participants", value: "500+", icon: Award },
  ];

  const domains = [
    {
      title: "Data Science",
      desc: "End-to-end data pipelines, statistical modeling, exploratory data analysis, and predictive intelligence.",
      icon: Database,
      tag: "CORE PILLAR",
    },
    {
      title: "Artificial Intelligence",
      desc: "Deep neural architectures, autonomous systems, computer vision, and cognitive AI implementations.",
      icon: Brain,
      tag: "EXPANDING",
    },
    {
      title: "Machine Learning",
      desc: "Supervised and unsupervised models, reinforcement learning, feature engineering, and model deployment.",
      icon: Cpu,
      tag: "HIGH DEMAND",
    },
    {
      title: "Data Analytics",
      desc: "Actionable business intelligence, interactive visual dashboards, metrics tracking, and data storytelling.",
      icon: BarChart3,
      tag: "ANALYTICS",
    },
    {
      title: "Web Development",
      desc: "Modern reactive web applications, API integrations, distributed microservices, and full-stack engineering.",
      icon: Globe2,
      tag: "ENGINEERING",
    },
    {
      title: "Emerging Technologies",
      desc: "Web3 networks, edge computing, Internet of Things (IoT), and ethical AI governance frameworks.",
      icon: Layers,
      tag: "FRONTIER",
    },
  ];

  return (
    <div className="flex flex-col gap-28 pb-24 overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-16 pb-20 overflow-hidden bg-brand-hero">
        {/* Subtle orange ambient lighting circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-orange/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-brand-red/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-brand-yellow/10 rounded-full blur-[130px] pointer-events-none" />

        {/* Abstract Data Visualization & Network Lines */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(#FC8706_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          {/* Chapter Identification Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-background-elevated/90 border border-brand-border shadow-lg shadow-brand-red/10 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Society for Data Science
            </span>
            <span className="text-brand-border">•</span>
            <span className="text-xs text-brand-secondary font-medium">MITAOE Student Chapter</span>
          </div>

          {/* Official Required Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight max-w-5xl leading-[1.1] mb-6 text-brand-white">
            Where <span className="brand-text-gradient">Data Meets</span> Innovation.
          </h1>

          {/* Official Required Tagline */}
          <div className="inline-block mb-6">
            <span className="text-lg sm:text-2xl font-extrabold uppercase tracking-[0.25em] text-brand-yellow px-4 py-1.5 rounded-xl bg-background-card/80 border border-brand-border">
              Think. Analyze. Innovate.
            </span>
          </div>

          {/* Narrative Summary */}
          <p className="text-base sm:text-xl text-brand-secondary max-w-3xl mb-10 leading-relaxed font-normal">
            Society for Data Science (S4DS) at MIT Academy of Engineering empowers students with
            industry-grade mentorship, research publications, collaborative hackathons, and our
            national flagship symposium — <strong className="text-brand-white font-semibold">TECHNEX 2K26</strong>.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link
              href="/technex-2k26"
              className="px-8 py-4 rounded-xl brand-btn text-brand-white font-extrabold text-base shadow-xl shadow-brand-red/25 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Register for TECHNEX 2K26
            </Link>
            <Link
              href="/membership"
              className="px-8 py-4 rounded-xl bg-background-elevated hover:bg-background-card text-brand-secondary hover:text-brand-white font-semibold text-base transition-all border border-brand-border hover:border-brand-border-hover flex items-center gap-2"
            >
              Join S4DS (Starts Feb 2027)
              <ArrowRight className="w-4 h-4 text-brand-orange" />
            </Link>
          </div>

          {/* TECHNEX Flagship Banner Strip */}
          <div className="w-full max-w-4xl p-6 rounded-2xl bg-background-card/90 border border-brand-orange/40 shadow-2xl shadow-brand-orange/10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div className="flex items-center gap-4 text-left">
              <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-br from-brand-red to-brand-orange text-brand-white shadow-lg shadow-brand-red/30 flex items-center justify-center shrink-0">
                <Flame className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-brand-yellow text-slate-950 uppercase tracking-wider">
                    Annual Flagship
                  </span>
                  <h3 className="text-lg font-bold text-brand-white">TECHNEX 2K26 Project Expo</h3>
                </div>
                <p className="text-sm text-brand-muted">
                  Cash prize pool of ₹50,000+ • Direct incubation access • Evaluated by senior industry jury
                </p>
              </div>
            </div>

            <Link
              href="/technex-2k26"
              className="px-5 py-2.5 rounded-xl bg-background-elevated hover:bg-brand-orange/20 text-brand-yellow font-bold text-sm border border-brand-border-hover shrink-0 flex items-center gap-1.5 transition-colors"
            >
              View Expo Tracks <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. METRICS & IMPACT
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-background-card border border-brand-border hover:border-brand-border-hover transition-all flex flex-col items-center text-center group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-background-elevated border border-brand-border flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-brand-orange transition-all">
                  <Icon className="w-6 h-6 text-brand-orange" />
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-white mb-1">
                  {s.value}
                </span>
                <span className="text-xs sm:text-sm text-brand-muted font-medium">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. ABOUT S4DS MITAOE (EDITORIAL STYLE)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-14 rounded-3xl bg-background-secondary border border-brand-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-orange">
                About The Society
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-white leading-tight">
                Catalyzing Research, Data Literacy & Tech Leadership at MITAOE
              </h2>
              <p className="text-sm sm:text-base text-brand-secondary leading-relaxed">
                The Society for Data Science (S4DS) Student Chapter at MIT Academy of Engineering,
                Alandi, Pune is dedicated to bridging the divide between academic foundations and
                industrial engineering practices. We nurture students through rigorous coding cohorts,
                applied research initiatives, and national hackathons.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-brand-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Hands-on algorithmic masterclasses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Faculty-backed research papers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Annual TECHNEX Project Expo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Direct alumni and mentor networks</span>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-yellow hover:text-brand-orange transition-colors"
                >
                  Read Full Chapter Charter & History <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-background-card border border-brand-border">
                <span className="text-xs font-mono text-brand-orange block mb-1">AFFILIATION</span>
                <h4 className="text-base font-bold text-brand-white">MIT Academy of Engineering</h4>
                <p className="text-xs text-brand-muted mt-1">
                  Department of Computer Science and Engineering (Data Science)
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-background-card border border-brand-border">
                <span className="text-xs font-mono text-brand-orange block mb-1">FACULTY COORDINATOR</span>
                <h4 className="text-base font-bold text-brand-white">Prof. Aparna Kulkarni</h4>
                <p className="text-xs text-brand-muted mt-1">
                  Guiding innovation, student growth, and institutional alignment.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-background-card border border-brand-border">
                <span className="text-xs font-mono text-brand-orange block mb-1">STUDENT LEADERSHIP</span>
                <h4 className="text-base font-bold text-brand-white">President: Harsh Holkar</h4>
                <p className="text-xs text-brand-muted mt-1">
                  Supported by Secretary Mansi Munde and a dedicated 17-member council.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. OFFICIAL DOMAINS SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2 block">
              Core Technical Focus
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-white">
              Areas of Specialization
            </h2>
          </div>
          <p className="text-sm text-brand-muted max-w-md">
            Our members engage in continuous skill progression and project incubation across 6 primary domains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((dom, i) => {
            const Icon = dom.icon;
            return (
              <div
                key={i}
                className="p-7 rounded-2xl bg-background-card border border-brand-border hover:border-brand-border-hover transition-all group flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-background-elevated border border-brand-border flex items-center justify-center group-hover:border-brand-orange transition-colors">
                      <Icon className="w-6 h-6 text-brand-orange" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-background-elevated text-brand-yellow border border-brand-border">
                      {dom.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-white mb-2 group-hover:text-brand-orange transition-colors">
                    {dom.title}
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    {dom.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted">
                  <span>Track 0{i + 1}</span>
                  <span className="text-brand-yellow font-semibold group-hover:translate-x-1 transition-transform">
                    Explore Track →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. UPCOMING EVENTS
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2 block">
              Workshops & Seminars
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-white">
              Upcoming Chapter Events
            </h2>
          </div>
          <Link
            href="/events"
            className="text-sm font-semibold text-brand-orange hover:text-brand-yellow flex items-center gap-1 transition-colors"
          >
            View All Events ({events.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="rounded-2xl bg-background-card border border-brand-border overflow-hidden hover:border-brand-border-hover transition-all flex flex-col group shadow-lg"
            >
              <div className="relative h-48 bg-background-elevated overflow-hidden">
                <Image
                  src={evt.posterUrl || "/images/technex-poster.png"}
                  alt={evt.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-background-secondary/90 text-brand-orange backdrop-blur-md border border-brand-border">
                    {evt.category}
                  </span>
                </div>
                {evt.prizePool && (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-brand-yellow text-slate-950 shadow-md">
                      {evt.prizePool}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-brand-yellow font-semibold flex items-center gap-2 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{evt.date}</span>
                    <span className="text-brand-muted">•</span>
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{evt.time}</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-white mb-2 line-clamp-1 group-hover:text-brand-orange transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-sm text-brand-muted line-clamp-2 leading-relaxed mb-4">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border flex items-center justify-between text-xs">
                  <span className="text-brand-muted truncate max-w-[170px] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                    {evt.venue}
                  </span>
                  <Link
                    href={`/events`}
                    className="font-bold text-brand-orange hover:text-brand-yellow transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. TECHNEX 2K26 DEDICATED HIGHLIGHT
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-background-card via-background-elevated to-background-secondary border border-brand-orange/40 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-red/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-red/20 border border-brand-red/40 text-brand-orange text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Flagship National Symposium
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-brand-white">
                TECHNEX 2K26 National Project Expo
              </h2>
              <p className="text-base text-brand-secondary leading-relaxed max-w-2xl">
                The premier arena for visionary student creators to showcase working prototypes,
                algorithms, and research solutions before distinguished academic judges and industry tech leaders.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="px-4 py-2 rounded-xl bg-background-secondary border border-brand-border">
                  <span className="text-xs text-brand-muted block">Prize Pool</span>
                  <span className="text-lg font-extrabold text-brand-yellow">₹50,000+</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-background-secondary border border-brand-border">
                  <span className="text-xs text-brand-muted block">Expo Date</span>
                  <span className="text-lg font-extrabold text-brand-white">Nov 28, 2026</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-background-secondary border border-brand-border">
                  <span className="text-xs text-brand-muted block">Venue</span>
                  <span className="text-lg font-extrabold text-brand-white">MITAOE Pune</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/technex-2k26"
                className="w-full py-4 rounded-xl brand-btn text-brand-white font-extrabold text-center shadow-lg shadow-brand-red/30 hover:scale-105 transition-all text-sm uppercase tracking-wider"
              >
                Register Project Now
              </Link>
              <Link
                href="/technex-2k26"
                className="w-full py-3.5 rounded-xl bg-background-secondary hover:bg-background-card border border-brand-border text-brand-secondary hover:text-brand-white font-semibold text-center text-sm transition-colors"
              >
                Download Rulebook & Tracks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. LEADERSHIP PREVIEW
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2 block">
              Governance & Mentorship
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-white">
              Chapter Leadership
            </h2>
          </div>
          <Link
            href="/team"
            className="text-sm font-semibold text-brand-orange hover:text-brand-yellow flex items-center gap-1 transition-colors"
          >
            Meet All 17 Team Members <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreTeam.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl bg-background-card border border-brand-border overflow-hidden p-5 flex flex-col items-center text-center hover:border-brand-border-hover transition-all group shadow-md"
            >
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden mb-4 border-2 border-brand-border group-hover:border-brand-orange transition-colors">
                <Image
                  src={member.photoUrl || member.avatarUrl || "/images/team/kunal-gavit.jpg"}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-base font-bold text-brand-white group-hover:text-brand-orange transition-colors">
                {member.name}
              </h3>
              <p className="text-xs font-semibold text-brand-yellow mt-0.5 mb-1">
                {member.role}
              </p>
              <p className="text-[11px] text-brand-muted">
                {member.department || "Data Science"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. GALLERY PREVIEW
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2 block">
              Memories & Moments
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-white">
              Event Gallery
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-semibold text-brand-orange hover:text-brand-yellow flex items-center gap-1 transition-colors"
          >
            View Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {galleryPreview.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {galleryPreview.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-background-card border border-brand-border overflow-hidden hover:border-brand-border-hover transition-all group shadow-md"
              >
                <div className="relative h-56 bg-background-elevated overflow-hidden">
                  <Image
                    src={item.imageUrl || "/images/technex-poster.png"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-main via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-orange text-brand-white mb-1 inline-block">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-brand-white line-clamp-1">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-background-card border border-brand-border text-center space-y-2">
            <h4 className="text-base font-bold text-brand-white">Event Highlights & Gallery</h4>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Photographs, symposium memories, and award ceremonies will be published here following TECHNEX 2K26.
            </p>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. MEMBERSHIP CTA
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-background-card via-background-elevated to-background-secondary border border-brand-orange/40 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-red/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="w-14 h-14 rounded-2xl bg-brand-orange/15 border border-brand-orange/40 flex items-center justify-center mb-6 relative z-10">
            <Users className="w-7 h-7 text-brand-orange" />
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-brand-orange/20 text-brand-yellow uppercase tracking-wider border border-brand-orange/40 mb-3 relative z-10">
            Cohort Intake Starts February 2027
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-brand-white max-w-2xl leading-tight mb-4 relative z-10">
            Join <span className="brand-text-gradient">Society for Data Science</span>, MITAOE
          </h2>
          <p className="text-base sm:text-lg text-brand-secondary max-w-xl mb-8 leading-relaxed relative z-10">
            Official student membership intake will launch in <strong className="text-brand-yellow font-bold">February 2027</strong>. Explore verified membership certificates, discounted entry to TECHNEX 2K26, closed-door AI/ML masterclasses, and project team allocations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link
              href="/membership"
              className="px-8 py-3.5 rounded-xl brand-btn text-brand-white font-extrabold text-base transition-transform hover:scale-105 shadow-xl shadow-brand-red/30"
            >
              View Membership Details (Opens Feb 2027)
            </Link>
            <Link
              href="/about"
              className="px-8 py-3.5 rounded-xl bg-background-elevated hover:bg-background-card text-brand-secondary hover:text-brand-white font-semibold text-base transition-colors border border-brand-border hover:border-brand-border-hover"
            >
              Learn More About Chapter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
