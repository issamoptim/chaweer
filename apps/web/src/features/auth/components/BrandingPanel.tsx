import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BrandingPanel() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-between lg:p-12 lg:bg-muted">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        Retour à l'accueil
      </Link>

      <div className="flex flex-col gap-8">
        <span className="text-4xl font-bold tracking-tight text-primary">
          Chaweer
        </span>
        <h2 className="text-2xl font-bold leading-tight text-foreground">
          Votre accès au droit, simplifié.
        </h2>
        <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
          Trouvez des réponses juridiques fiables, échangez avec des
          professionnels qualifiés, et gérez vos démarches en toute
          confiance.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">
              Conseils personnalisés
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">
              Professionnels vérifiés
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">
              Données sécurisées
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        © 2026 Chaweer. Tous droits réservés.
      </p>
    </div>
  );
}
