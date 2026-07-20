import type { ReactNode } from "react";
import { Check } from "lucide-react";

interface StickyActionBarProps {
  status: ReactNode;
  saved?: boolean;
  children: ReactNode;
}

export function StickyActionBar({ status, saved, children }: StickyActionBarProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 mt-8 border-t border-[#EFEDE9] bg-[#F7F7F5]/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="mx-auto flex max-w-[860px] items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[13.5px]">
          {saved && <Check className="h-4 w-4 text-[#0F766E]" strokeWidth={2.5} />}
          <span className={saved ? "font-semibold text-[#0F766E]" : "text-[#6B6862]"}>
            {status}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3">{children}</div>
      </div>
    </div>
  );
}
