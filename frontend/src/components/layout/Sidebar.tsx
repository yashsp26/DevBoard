import { type LucideIcon, PanelLeft } from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "../../utils/cn";

export type SidebarItem = {
  icon: LucideIcon;
  label: string;
  to: string;
};

type SidebarProps = {
  items: SidebarItem[];
};

type SidebarNavigationProps = SidebarProps & {
  onNavigate?: () => void;
};

export function SidebarNavigation({ items, onNavigate }: SidebarNavigationProps) {
  return (
    <nav aria-label="Primary navigation" className="grid gap-2">
      {items.map(({ icon: Icon, label, to }) => (
        <NavLink
          className={({ isActive }) =>
            cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-[background-color,color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary",
              isActive
                ? "neu-raised-sm bg-primary/12 text-primary"
                : "text-muted hover:bg-primary/8 hover:text-text",
            )
          }
          key={to}
          onClick={onNavigate}
          to={to}
        >
          <Icon aria-hidden="true" className="size-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col rounded-r-3xl border-r border-border/60 bg-surface p-5 shadow-(--shadow-elevation-3) lg:flex">
      <NavLink
        className="mb-8 flex items-center gap-2 px-2 text-lg font-semibold tracking-tight text-text"
        to="/dashboard"
      >
        <PanelLeft aria-hidden="true" className="size-5 text-primary" />
        DevLupo
      </NavLink>
      <SidebarNavigation items={items} />
    </aside>
  );
}
