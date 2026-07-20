interface AppHeaderProps {
  userName?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function AppHeader({ userName = "IM" }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between bg-white px-10 py-[15px] border-b border-[#E9E7E3]">
      <span className="text-[19px] font-extrabold text-[#0F766E]">
        Chaweer
      </span>
      <div className="flex items-center gap-6">
        <nav className="hidden sm:flex items-center gap-6">
          <span className="text-[14px] font-medium text-[#6B6862]">Avocats</span>
          <span className="text-[14px] font-medium text-[#6B6862]">Mes rendez-vous</span>
        </nav>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F766E] text-[13.5px] font-bold text-white">
          {getInitials(userName)}
        </div>
      </div>
    </header>
  );
}
