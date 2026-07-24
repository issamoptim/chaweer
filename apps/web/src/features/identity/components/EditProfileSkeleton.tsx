import { LandingHeader } from "@/features/public/components/LandingHeader";

export function EditProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white" aria-label="Chargement du formulaire">
      <LandingHeader />
      <div className="mx-auto max-w-[760px] px-6 py-8 flex flex-col gap-[22px] animate-pulse">
        <div>
          <div className="h-[13.5px] w-16 rounded bg-[#E7E5E1] mb-3" />
          <div className="h-[28px] w-56 rounded-[8px] bg-[#E7E5E1]" />
          <div className="h-[14.5px] w-72 rounded bg-[#E7E5E1] mt-1" />
        </div>
        <div className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 flex flex-col gap-[20px] shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
          <div className="flex flex-col">
            <div className="h-[13.5px] w-16 rounded bg-[#E7E5E1] mb-[7px]" />
            <div className="h-[50px] w-full rounded-[12px] bg-[#E7E5E1]" />
          </div>
          <div className="flex flex-col">
            <div className="h-[13.5px] w-12 rounded bg-[#E7E5E1] mb-[7px]" />
            <div className="h-[50px] w-full rounded-[12px] bg-[#E7E5E1]" />
          </div>
          <div className="flex flex-col">
            <div className="h-[13.5px] w-16 rounded bg-[#E7E5E1] mb-[7px]" />
            <div className="h-[50px] w-full rounded-[12px] bg-[#E7E5E1]" />
          </div>
          <div className="flex flex-col">
            <div className="h-[13.5px] w-12 rounded bg-[#E7E5E1] mb-[7px]" />
            <div className="h-[50px] w-full rounded-[12px] bg-[#E7E5E1]" />
          </div>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            <div className="flex flex-col">
              <div className="h-[13.5px] w-10 rounded bg-[#E7E5E1] mb-[7px]" />
              <div className="h-[50px] w-full rounded-[12px] bg-[#E7E5E1]" />
            </div>
            <div className="flex flex-col">
              <div className="h-[13.5px] w-10 rounded bg-[#E7E5E1] mb-[7px]" />
              <div className="h-[50px] w-full rounded-[12px] bg-[#E7E5E1]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="h-[13.5px] w-16 rounded bg-[#E7E5E1] mb-[7px]" />
            <div className="h-[50px] w-full rounded-[12px] bg-[#E7E5E1]" />
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
          <div className="h-[50px] w-full sm:w-28 rounded-[12px] bg-[#E7E5E1]" />
          <div className="h-[50px] w-full sm:w-44 rounded-[12px] bg-[#E7E5E1]" />
        </div>
      </div>
    </div>
  );
}
