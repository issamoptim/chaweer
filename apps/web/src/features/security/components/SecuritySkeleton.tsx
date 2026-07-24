import { LandingHeader } from "@/features/public/components/LandingHeader";

export function SecuritySkeleton() {
  return (
    <div className="min-h-screen bg-white" aria-label="Chargement de la sécurité">
      <LandingHeader />
      <div className="mx-auto max-w-[760px] px-6 py-10 flex flex-col gap-[22px] animate-pulse">
        <div className="h-[28px] w-40 rounded-[8px] bg-[#E7E5E1]" />
        <div className="h-[20px] w-72 rounded bg-[#E7E5E1]" />
        <div className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)] space-y-3">
          <div className="h-5 w-24 rounded bg-[#E7E5E1]" />
          <div className="h-12 w-full rounded-[12px] bg-[#E7E5E1]" />
          <div className="h-12 w-full rounded-[12px] bg-[#E7E5E1]" />
        </div>
        <div className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)] space-y-3">
          <div className="h-5 w-32 rounded bg-[#E7E5E1]" />
          <div className="h-12 w-full rounded-[12px] bg-[#E7E5E1]" />
          <div className="h-12 w-full rounded-[12px] bg-[#E7E5E1]" />
          <div className="h-12 w-full rounded-[12px] bg-[#E7E5E1]" />
        </div>
        <div className="rounded-[16px] border border-[#F3D9D7] bg-[#FDF3F2] p-7 space-y-3">
          <div className="h-5 w-36 rounded bg-[#E9C9C7]" />
          <div className="h-4 w-full rounded bg-[#E9C9C7]" />
          <div className="h-11 w-44 rounded-[11px] bg-[#E9C9C7]" />
        </div>
      </div>
    </div>
  );
}
