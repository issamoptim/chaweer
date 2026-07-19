import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  searchable?: boolean;
  allowEmpty?: boolean;
}

export function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  disabled,
  error,
  placeholder = "Sélectionner…",
  searchable = true,
  allowEmpty = true,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = `${name}-error`;
  const hasError = Boolean(error);

  const filteredOptions = searchable
    ? options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()))
    : options;

  const handleSelect = useCallback(
    (selected: string) => {
      onChange(selected);
      setOpen(false);
      setSearch("");
    },
    [onChange],
  );

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    setHighlightedIndex(0);
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setSearch("");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    }
  }

  const totalOptions = allowEmpty ? filteredOptions.length + 1 : filteredOptions.length;
  const clampedIndex = Math.min(highlightedIndex, totalOptions - 1);

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-[13.5px] font-semibold text-foreground mb-[7px]">
        {label}
      </label>
      <div ref={containerRef} className="relative">
        <button
          id={name}
          type="button"
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex h-[50px] w-full items-center justify-between rounded-[12px] border-[1.5px] border-[#E7E5E1] bg-background px-[15px] text-[15px] font-medium text-foreground transition-colors focus:border-[#0F766E] focus:outline-none focus:ring-[3px] focus:ring-[rgba(20,184,166,0.40)] disabled:cursor-not-allowed disabled:bg-[#F2F1EF] disabled:text-[#9A968E]",
            hasError ? "border-[#B4231F]" : "",
            !value && "text-muted-foreground",
          )}
        >
          <span>{value || placeholder}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute z-50 mt-2 w-full rounded-[14px] border border-[#E7E5E1] bg-card p-2 shadow-[0_12px_32px_rgba(19,78,74,0.14)]"
          >
            {searchable && (
              <div className="mb-1.5">
                <div className="relative flex items-center gap-2 rounded-[10px] border border-[#E7E5E1] bg-background px-3 py-2.5">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Rechercher…"
                    className="w-full border-none bg-transparent text-[14px] text-foreground focus:outline-none"
                  />
                </div>
              </div>
            )}
            <div className="max-h-48 overflow-y-auto p-1">
              {allowEmpty && (
                <button
                  type="button"
                  role="option"
                  aria-selected={!value}
                  onMouseEnter={() => setHighlightedIndex(0)}
                  onClick={() => handleSelect("")}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[9px] px-3 py-[11px] text-[14.5px] transition-colors",
                    clampedIndex === 0 && "bg-primary/5",
                    !value
                      ? "font-semibold text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {value && <X className="h-4 w-4" />}
                    {placeholder}
                  </span>
                  {!value && <Check className="h-4 w-4 text-primary" />}
                </button>
              )}
              {filteredOptions.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">Aucun résultat</p>
              ) : (
                filteredOptions.map((option, index) => {
                  const optionIndex = allowEmpty ? index + 1 : index;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={value === option}
                      onMouseEnter={() => setHighlightedIndex(optionIndex)}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-sm transition-colors",
                        clampedIndex === optionIndex && "bg-primary/5",
                        value === option
                          ? "bg-[#E6F2F0] font-semibold text-primary"
                          : "text-foreground",
                      )}
                    >
                      {option}
                      {value === option && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      {hasError && (
        <p id={errorId} className="text-[13px] text-[#B4231F] mt-[7px]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
