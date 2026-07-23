import { ChaweerLogo } from "@/components/ChaweerLogo";

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <ChaweerLogo size="lg" />
      <p className="text-muted-foreground">Plateforme juridique marocaine</p>
    </div>
  );
}
