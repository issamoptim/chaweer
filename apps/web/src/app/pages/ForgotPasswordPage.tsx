import { AuthLayout, AuthCard, AuthHeader, TextLink } from "@/features/auth";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col gap-5">
          <AuthHeader
            title="Mot de passe oublié"
            description="Cette fonctionnalité sera bientôt disponible."
          />
          <div className="rounded-lg border border-border bg-surface-alt px-4 py-6 text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              La réinitialisation de mot de passe n'est pas encore disponible. Si vous avez perdu
              vos identifiants, contactez le support à{" "}
              <a
                href="mailto:support@chaweer.com"
                className="font-medium text-primary hover:underline"
              >
                support@chaweer.com
              </a>
              .
            </p>
          </div>
          <div className="flex justify-center">
            <TextLink to="/connexion">Retour à la connexion</TextLink>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
