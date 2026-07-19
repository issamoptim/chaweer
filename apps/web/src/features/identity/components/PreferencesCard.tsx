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
    <div className="rounded-[16px] border border-[#E9E7E3] bg-card p-7 shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)]">
      <h3 className="mb-4 text-[17px] font-bold text-foreground">Préférences</h3>

      <div className="space-y-6">
        <div>
          <p className="mb-3 text-[13px] font-medium text-[#9A968E]">Langue de l'interface</p>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={mutation.isPending}
                onClick={() => handleLanguageChange(option.value)}
                className={cn(
                  "h-[42px] rounded-[10px] border px-4 text-[14px] font-medium transition-colors",
                  profile.preferredLanguage === option.value
                    ? "border-[#0F766E] bg-[#0F766E] text-white"
                    : "border-[#E7E5E1] bg-white text-[#4B4A46] hover:bg-[#F7F7F5]",
                  mutation.isPending && "cursor-not-allowed opacity-50",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[13px] font-medium text-[#9A968E]">Notifications</p>

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
    <div className="flex items-center justify-between border-b border-[#F0EEEA] py-[15px] last:border-b-0">
      <div className="flex items-center gap-2">
        <span className={`text-[15px] font-medium ${disabled ? "text-[#9A968E]" : "text-foreground"}`}>{label}</span>
        {badge && (
          <span className="rounded-full bg-[#EEECE8] px-2 py-0.5 text-[12px] font-medium text-[#8A8681]">
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
          "relative inline-flex h-[28px] w-[46px] shrink-0 rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-[#0F766E]" : "bg-[#D8D5D0]",
          disabled && !checked && "bg-[#EDEBE7]",
          disabled && "cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow ring-0 transition-transform",
            checked ? "translate-x-[21px]" : "translate-x-[3px]",
          )}
        />
      </button>
    </div>
  );
}
