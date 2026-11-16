import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No items found",
  description = "There are no records matching your criteria at this moment.",
  actionLabel,
  onAction,
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-background-card border border-brand-border shadow-lg">
      <div className="w-14 h-14 rounded-2xl bg-background-elevated border border-brand-border flex items-center justify-center mb-4 text-brand-orange shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-brand-white mb-1.5">{title}</h3>
      <p className="text-sm text-brand-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2 text-xs font-bold rounded-xl brand-btn text-white transition-transform hover:scale-105 shadow-md shadow-brand-red/25"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
