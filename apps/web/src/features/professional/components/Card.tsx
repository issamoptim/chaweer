import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, description, children, className }: CardProps) {
  return (
    <section
      className={`rounded-[16px] border border-[#E9E7E3] bg-white p-[26px] shadow-[0_1px_2px_rgba(19,78,74,0.04),0_8px_24px_rgba(19,78,74,0.06)] ${className ?? ""}`}
    >
      {title && (
        <h2 className="text-[16px] font-bold text-[#1C1B1A]">{title}</h2>
      )}
      {description && (
        <p className="mt-1 text-[13.5px] text-[#6B6862]">{description}</p>
      )}
      <div className={title || description ? "mt-5" : ""}>{children}</div>
    </section>
  );
}
