import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toaster";
import { ProfessionalSidebar } from "./ProfessionalSidebar";
import { OnboardingStepper, type StepKey } from "./OnboardingStepper";
import { useProfessionalProfile } from "../hooks/useProfessionalProfile";

function stepFromPath(pathname: string): StepKey {
  if (pathname.startsWith("/pro/expertise")) return "expertise";
  if (pathname.startsWith("/pro/offre")) return "offer";
  return "profile";
}

export function ProfessionalLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { data: profile } = useProfessionalProfile();

  const current = stepFromPath(location.pathname);
  const done = profile?.completion?.sections ?? {
    identity: false,
    biography: false,
    contact: false,
    office: false,
    expertise: false,
    offer: false,
    education: false,
    experience: false,
    certifications: false,
    memberships: false,
  };

  return (
    <div className="flex min-h-screen bg-[#F7F7F5]">
      <ProfessionalSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main className="flex h-screen flex-1 flex-col overflow-y-auto">
        <ToastProvider>
          <div className="mx-auto w-full max-w-[860px] px-6 py-8 sm:px-8">
            <div className="mb-8">
              <OnboardingStepper current={current} done={done} />
            </div>
            <Outlet />
          </div>
        </ToastProvider>
      </main>
    </div>
  );
}
