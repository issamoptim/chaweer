import { cn } from "@/lib/utils";
import { useUpdatePreferences } from "../hooks/useUpdatePreferences";
import { useToast } from "@/hooks/useToast";
import type { ProfileData, PreferencesInput } from "../types/identity-types";

interface PreferencesCardProps {
  profile: ProfileData;
}

const languageOptions = [
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
  { value: "en", label: "English" },
] as const;

export function PreferencesCard({ profile }: PreferencesCardProps) {
  const mutation = useUpdatePreferences();
  const toast = useToast();

  function handleLanguageChange(value: PreferencesInput["preferredLanguage"]) {
    if (!value) return;
    mutation.mutate(
      { preferredLanguage: value },
      {
        onSuccess: () => toast.showSuccess("Préférences enregistrées"),
        onError: () => toast.showError("Erreur lors de l'enregistrement"),
      },
    );
  }

  function handleNotificationToggle(
    field: "notificationEmail" | "notificationPush",
    value: boolean,
  ) {
    mutation.mutate(
      { [field]: value } as PreferencesInput,
      {
        onSuccess: () => toast.showSuccess("Préférences enregistrées"),
        onError: () => toast.showError("Erreur lors de l'enregistrement"),
      },
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-base font-semibold text-foreground">Préférences</h3>

      <div className="space-y-6">
        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">Langue de l'interface</p>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={mutation.isPending}
                onClick={() => handleLanguageChange(option.value)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  profile.preferredLanguage === option.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent",
                  mutation.isPending && "cursor-not-allowed opacity-50",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Notifications</p>

          <NotificationToggle
            label="Notifications par e-mail"
            checked={profile.notificationEmail}
            disabled={mutation.isPending}
            onChange={(checked) => handleNotificationToggle("notificationEmail", checked)}
          />

          <NotificationToggle
            label="Notifications push"
            checked={profile.notificationPush}
            disabled={mutation.isPending}
            onChange={(checked) => handleNotificationToggle("notificationPush", checked)}
          />

          <NotificationToggle
            label="Notifications SMS"
            checked={false}
            disabled={true}
            onChange={() => {}}
            badge="Bientôt disponible"
          />
        </div>
      </div>
    </div>
  );
}

interface NotificationToggleProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
  badge?: string;
}

function NotificationToggle({ label, checked, disabled, onChange, badge }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">{label}</span>
        {badge && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-primary" : "bg-muted",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}
