import { TextLink } from "@/features/auth";

export function EditProfilePage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Modifier mon profil</h1>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Cette fonctionnalité sera disponible dans une prochaine mise à jour.
        </p>
      </div>
      <TextLink to="/mon-compte">← Retour à mon profil</TextLink>
    </div>
  );
}
