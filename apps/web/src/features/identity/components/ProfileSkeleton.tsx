import { LandingHeader } from "@/features/public/components/LandingHeader";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white" aria-label="Chargement du profil">
      <LandingHeader />
      <div className="mx-auto max-w-[760px] px-6 py-10 flex flex-col gap-[22px] animate-pulse">
        <div className="h-[28px] w-40 rounded-[8px] bg-[#E7E5E1]" />
        <div className="flex items-center gap-4 rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
          <div className="h-16 w-16 rounded-full bg-[#E7E5E1]" />
          <div className="space-y-2">
            <div className="h-5 w-40 rounded bg-[#E7E5E1]" />
            <div className="h-4 w-28 rounded bg-[#E7E5E1]" />
            <div className="h-4 w-48 rounded bg-[#E7E5E1]" />
          </div>
        </div>
        <div className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)] space-y-3">
          <div className="h-5 w-32 rounded bg-[#E7E5E1]" />
          <div className="h-4 w-full rounded bg-[#E7E5E1]" />
          <div className="h-4 w-full rounded bg-[#E7E5E1]" />
          <div className="h-4 w-3/4 rounded bg-[#E7E5E1]" />
          <div className="h-4 w-full rounded bg-[#E7E5E1]" />
          <div className="h-4 w-2/3 rounded bg-[#E7E5E1]" />
          <div className="h-4 w-full rounded bg-[#E7E5E1]" />
        </div>
        <div className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)] space-y-3">
          <div className="h-5 w-40 rounded bg-[#E7E5E1]" />
          <div className="h-4 w-full rounded bg-[#E7E5E1]" />
          <div className="h-4 w-full rounded bg-[#E7E5E1]" />
          <div className="h-4 w-1/2 rounded bg-[#E7E5E1]" />
        </div>
      </div>
    </div>
  );
}
