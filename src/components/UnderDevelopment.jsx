"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Construction,
  ArrowLeft,
  Flame,
  MessageSquare,
  Layers,
  Clock,
  Compass,
} from "lucide-react";

export default function UnderDevelopment({ section = "This Section" }) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative max-w-2xl w-full p-8 sm:p-12 rounded-3xl bg-background-card border border-brand-orange/30 shadow-2xl text-center space-y-8 overflow-hidden">
        {/* Ambient subtle glowing gradients */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Icon Header */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand-orange/20 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-red via-brand-orange to-brand-yellow p-1 shadow-2xl shadow-brand-red/30">
            <div className="w-full h-full bg-[#17110D] rounded-2xl flex items-center justify-center p-2">
              <Image
                src="/images/logo.png"
                alt="S4DS MITAOE Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Badge & Headings */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/35 text-xs font-bold text-brand-orange uppercase tracking-wider">
            <Construction className="w-4 h-4 text-brand-yellow" />
            Under Development • {section}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-brand-white tracking-tight">
            Something Exciting Is <span className="brand-text-gradient">Coming!</span>
          </h1>

          <p className="text-sm sm:text-base text-brand-secondary max-w-lg mx-auto leading-relaxed">
            We&apos;re working behind the scenes to bring you something amazing. This section will be available soon.
          </p>
        </div>

        {/* Featured Live Event Notice: TECHNEX 2K26 */}
        <div className="p-5 rounded-2xl bg-background-elevated border border-brand-orange/30 text-left space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-brand-border">
            <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-brand-orange" /> Event Is Live!
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Registrations Open
            </span>
          </div>

          <p className="text-xs text-brand-secondary leading-relaxed">
            While our full website is being crafted, registrations for <strong className="text-brand-white">TECHNEX 2K26 – The Project Innovation Expo</strong> are actively live. Present your prototype at MITAOE Pune and connect with venture mentors!
          </p>

          <div className="pt-1">
            <Link
              href="/technex-2k26"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange hover:text-brand-yellow transition-colors"
            >
              Explore TECHNEX 2K26 & Register Team &rarr;
            </Link>
          </div>
        </div>

        {/* Action Navigation Buttons */}
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-background-secondary hover:bg-background-elevated text-brand-white border border-brand-border text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Homepage
          </Link>

          <Link
            href="/technex-2k26"
            className="px-5 py-2.5 rounded-xl brand-btn text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-red/30"
          >
            <Flame className="w-3.5 h-3.5 text-brand-yellow" /> Go to TECHNEX 2K26
          </Link>

          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-background-secondary hover:bg-background-elevated text-brand-yellow hover:text-white border border-brand-border text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand-orange" /> Contact Us
          </Link>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-brand-border flex items-center justify-center gap-2 text-[11px] text-brand-muted">
          <Clock className="w-3.5 h-3.5 text-brand-orange" />
          <span>Society for Data Science (S4DS) • MIT Academy of Engineering, Pune</span>
        </div>
      </div>
    </div>
  );
}
