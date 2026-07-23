import { ChaweerLogo } from "@/components/ChaweerLogo";

export function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <ChaweerLogo size="lg" />
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  );
}
