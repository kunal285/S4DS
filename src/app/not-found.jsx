import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange shadow-lg shadow-brand-red/20">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
      </div>

      <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-yellow">
        404 • Page Not Found
      </span>

      <h1 className="text-4xl sm:text-5xl font-black text-brand-white max-w-md">
        Coordinates Lost in <span className="brand-text-gradient">Space</span>
      </h1>

      <p className="text-sm sm:text-base text-brand-muted max-w-sm leading-relaxed">
        The page you requested does not exist or has been relocated to another section of the chapter portal.
      </p>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl brand-btn text-brand-white font-extrabold text-sm transition-transform hover:scale-105 shadow-xl shadow-brand-red/30"
        >
          <ArrowLeft className="w-4 h-4" /> Return to S4DS MITAOE
        </Link>
      </div>
    </div>
  );
}
