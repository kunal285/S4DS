export default function LoadingSkeleton({ count = 3, type = "card" }) {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-background-card border border-brand-border p-6 space-y-4 shadow-lg">
            <div className="h-44 bg-background-elevated rounded-2xl w-full" />
            <div className="h-5 bg-background-elevated rounded w-3/4" />
            <div className="h-4 bg-background-elevated/70 rounded w-full" />
            <div className="h-4 bg-background-elevated/70 rounded w-2/3" />
            <div className="pt-2 flex justify-between items-center">
              <div className="h-4 bg-background-elevated/50 rounded w-24" />
              <div className="h-8 bg-background-elevated rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="w-full bg-background-card border border-brand-border rounded-2xl overflow-hidden animate-pulse shadow-lg">
        <div className="h-12 bg-background-elevated border-b border-brand-border" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-16 border-b border-brand-border/40 px-6 flex items-center gap-4">
            <div className="h-4 bg-background-elevated rounded w-1/4" />
            <div className="h-4 bg-background-elevated/70 rounded w-1/4" />
            <div className="h-4 bg-background-elevated/70 rounded w-1/4" />
            <div className="h-8 bg-background-elevated/50 rounded w-24 ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 bg-background-card border border-brand-border rounded-2xl" />
      ))}
    </div>
  );
}
