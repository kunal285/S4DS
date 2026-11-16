"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ type = "success", message, onClose }) {
  if (!message) return null;

  const styles = {
    success: "bg-[#1f2e1b]/95 border-emerald-500/40 text-emerald-200",
    error: "bg-[#2d1210]/95 border-rose-500/50 text-rose-200",
    info: "bg-[#281a10]/95 border-brand-orange/40 text-brand-light",
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-yellow shrink-0" />,
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all ${styles[type] || styles.info}`}>
      {icons[type] || icons.info}
      <div className="flex-1 text-sm font-medium pr-2">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
