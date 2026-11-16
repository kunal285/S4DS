"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem("s4ds_admin_token", data.token);
        }
        router.push("/admin");
      } else {
        setError(data.error || "Authentication failed. Check credentials.");
      }
    } catch (err) {
      setError("Network error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-background-main relative">
      {/* Warm ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-background-card border border-brand-border space-y-6 shadow-2xl relative z-10">
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-xl shadow-brand-red/20 mx-auto border border-brand-border bg-background-elevated p-1">
            <Image src="/images/logo.png" alt="S4DS MITAOE Logo" fill className="object-contain p-0.5" priority />
          </div>
          <h1 className="text-2xl font-black text-brand-white">Administrator Portal</h1>
          <p className="text-xs text-brand-muted">
            Authorized S4DS MITAOE chapter executive and faculty access only.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#2d1210]/95 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Enter administrator email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white placeholder-brand-muted text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter administrator password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background-elevated border border-brand-border text-brand-white placeholder-brand-muted text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl brand-btn text-brand-white font-extrabold text-sm shadow-xl shadow-brand-red/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Dashboard"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-brand-muted hover:text-brand-orange transition-colors">
            ← Return to Public Chapter Site
          </Link>
        </div>
      </div>
    </div>
  );
}
