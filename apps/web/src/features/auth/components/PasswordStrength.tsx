interface PasswordStrengthProps {
  value: string;
}

type Strength = "weak" | "medium" | "strong";

function getStrength(password: string): Strength {
  if (password.length < 8) return "weak";
  let variety = 0;
  if (/[A-Z]/.test(password)) variety++;
  if (/[a-z]/.test(password)) variety++;
  if (/[0-9]/.test(password)) variety++;
  if (variety >= 3) return "strong";
  if (variety >= 2) return "medium";
  return "weak";
}

const labels: Record<Strength, string> = {
  weak: "Faible",
  medium: "Moyen",
  strong: "Fort",
};

const colors: Record<Strength, string> = {
  weak: "bg-destructive",
  medium: "bg-yellow-500",
  strong: "bg-green-600",
};

const labelColors: Record<Strength, string> = {
  weak: "text-destructive",
  medium: "text-orange-500",
  strong: "text-green-600",
};

const bars: Record<Strength, number> = {
  weak: 1,
  medium: 2,
  strong: 3,
};

export function PasswordStrength({ value }: PasswordStrengthProps) {
  if (!value) return null;

  const strength = getStrength(value);

  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= bars[strength] ? colors[strength] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${labelColors[strength]}`}>{labels[strength]}</p>
    </div>
  );
}
