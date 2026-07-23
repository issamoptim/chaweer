import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toaster";
import { ProfessionalSidebar } from "./ProfessionalSidebar";

export function ProfessionalLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F7F7F5]">
      <ProfessionalSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main className="flex h-screen flex-1 flex-col overflow-y-auto">
        <ToastProvider>
          <div className="mx-auto w-full max-w-[860px] px-6 py-8 sm:px-8">
            <Outlet />
          </div>
        </ToastProvider>
      </main>
    </div>
  );
}
