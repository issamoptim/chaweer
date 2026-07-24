import { Outlet, useLocation } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toaster";

const FULL_BLEED_ROUTES = ["/"];

function isFullBleed(pathname: string): boolean {
  return FULL_BLEED_ROUTES.includes(pathname);
}

export function MainLayout() {
  const { pathname } = useLocation();
  const fullBleed = isFullBleed(pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {fullBleed ? (
        <ToastProvider>
          <Outlet />
        </ToastProvider>
      ) : (
        <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
          <ToastProvider>
            <Outlet />
          </ToastProvider>
        </main>
      )}
    </div>
  );
}
