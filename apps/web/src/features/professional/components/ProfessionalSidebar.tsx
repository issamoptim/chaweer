import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  Scale,
  Video,
  CalendarDays,
  Rocket,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/features/auth";
import { ProBadge } from "./ProBadge";

interface NavItem {
  label: string;
  to?: string;
  icon: LucideIcon;
  soon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", icon: LayoutDashboard, soon: true },
  { label: "Mon profil", to: "/pro/profil", icon: UserRound },
  { label: "Mon expertise", to: "/pro/expertise", icon: Scale },
  { label: "Offre de consultation", to: "/pro/offre", icon: Video },
];

const NAV_ITEMS_SECONDARY: NavItem[] = [
  { label: "Disponibilités", icon: CalendarDays, soon: true },
  { label: "Publication", icon: Rocket, soon: true },
];

interface ProfessionalSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function ProfessionalSidebar({ collapsed, onToggle }: ProfessionalSidebarProps) {
  const { user } = useAuth();

  const displayName =
    user && (user.firstName || user.lastName)
      ? `${user.firstName} ${user.lastName}`.trim()
      : (user?.email ?? "");

  function renderItem(item: NavItem) {
    const Icon = item.icon;

    if (item.soon || !item.to) {
      return (
        <div
          key={item.label}
          aria-disabled="true"
          className="flex cursor-not-allowed items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-medium text-[#B4AFA6]"
          title="Bientôt disponible"
        >
          <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          {!collapsed && (
            <span className="flex flex-1 items-center justify-between">
              {item.label}
              <span className="rounded-full bg-[#EEECE8] px-2 py-0.5 text-[10.5px] font-semibold text-[#8A8681]">
                Bientôt
              </span>
            </span>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.label}
        to={item.to}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-medium transition-colors ${
            isActive
              ? "bg-[#E6F2F0] font-semibold text-[#0F766E]"
              : "text-[#4B4842] hover:bg-[#F0EEEA]"
          }`
        }
      >
        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        {!collapsed && <span>{item.label}</span>}
      </NavLink>
    );
  }

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-[#E9E7E3] bg-white transition-[width] duration-200 ${
        collapsed ? "w-[76px]" : "w-[240px]"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        {collapsed ? (
          <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F766E] text-[15px] font-bold text-white">
            C
          </span>
        ) : (
          <div className="flex flex-col gap-1.5">
            <span className="text-[18px] font-bold tracking-tight text-[#0F766E]">Chaweer</span>
            <ProBadge />
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#6B6862] transition-colors hover:bg-[#F0EEEA] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(20,184,166,0.40)]"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(renderItem)}
        <div className="my-2 h-px bg-[#EFEDE9]" />
        {NAV_ITEMS_SECONDARY.map(renderItem)}
      </nav>

      <div className="border-t border-[#EFEDE9] p-3">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-2.5 px-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F2F0] text-[13px] font-bold text-[#0F766E]">
              {(displayName || "?").charAt(0).toUpperCase()}
            </span>
            <span className="truncate text-[13px] font-semibold text-[#1C1B1A]">
              {displayName || "Avocat"}
            </span>
          </div>
        )}
        <Link
          to="/"
          className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-medium text-[#6B6862] transition-colors hover:bg-[#F0EEEA]"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Retour au site</span>}
        </Link>
      </div>
    </aside>
  );
}
