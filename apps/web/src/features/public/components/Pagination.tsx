import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const maxVisible = 5;
  const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav
      className="mx-auto flex max-w-[1500px] items-center justify-center gap-2 px-8 pb-12 sm:px-12 lg:px-16"
      aria-label={t("landing.pagination.label")}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={t("landing.pagination.prev")}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="flex h-9 min-w-9 items-center justify-center rounded-[10px] border border-border px-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt"
          >
            1
          </button>
          {start > 2 && (
            <span className="px-1 text-text-faint">…</span>
          )}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={
            p === currentPage
              ? "flex h-9 min-w-9 items-center justify-center rounded-[10px] bg-primary px-2 text-sm font-bold text-white"
              : "flex h-9 min-w-9 items-center justify-center rounded-[10px] border border-border px-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt"
          }
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-text-faint">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex h-9 min-w-9 items-center justify-center rounded-[10px] border border-border px-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={t("landing.pagination.next")}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
}
