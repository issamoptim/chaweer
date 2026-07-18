import { Outlet } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toaster";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <ToastProvider>
          <Outlet />
        </ToastProvider>
      </main>
    </div>
  );
}
