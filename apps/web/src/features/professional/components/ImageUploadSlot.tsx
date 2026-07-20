import { useRef } from "react";
import { Camera } from "lucide-react";

interface ImageUploadSlotProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
}

const MAX_SIZE = 2 * 1024 * 1024;

export function ImageUploadSlot({ value, onChange, disabled }: ImageUploadSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE) return;

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        aria-label="Téléverser une photo de profil"
        className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E7E5E1] bg-[#F7F7F5] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)] disabled:cursor-not-allowed"
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <Camera className="h-6 w-6 text-[#9A968E]" aria-hidden="true" />
        )}
      </button>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="w-fit text-[13.5px] font-semibold text-[#0F766E] hover:underline disabled:cursor-not-allowed disabled:text-[#9A968E]"
        >
          {value ? "Changer la photo" : "Ajouter une photo"}
        </button>
        <p className="text-[12.5px] text-[#9A968E]">
          Format carré recommandé, 2 Mo maximum.
        </p>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="w-fit text-[12.5px] text-[#6B6862] hover:underline"
          >
            Retirer
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
