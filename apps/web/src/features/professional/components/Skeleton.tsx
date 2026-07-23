export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[8px] bg-[#E9E7E3] ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[16px] border border-[#E9E7E3] bg-white p-[26px] shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
      <SkeletonBlock className="h-5 w-40" />
      <div className="mt-5 flex flex-col gap-4">
        <SkeletonBlock className="h-[50px] w-full" />
        <SkeletonBlock className="h-[50px] w-full" />
      </div>
    </div>
  );
}

export function SkeletonPage({ cards = 3 }: { cards?: number }) {
  return (
    <div className="flex flex-col gap-5">
      <SkeletonBlock className="h-8 w-64" />
      <SkeletonBlock className="h-4 w-96" />
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
