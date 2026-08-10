import { type LucideIcon, PanelLeft } from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "../../utils/cn";

type SidebarItem = {
  icon: LucideIcon;
  label: string;
  to: string;
};

type SidebarProps = {
  items: SidebarItem[];
};

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-border bg-surface p-4 lg:flex">
      <NavLink
        className="mb-8 flex items-center gap-2 px-2 text-lg font-semibold tracking-tight text-text"
        to="/dashboard"
      >
        <PanelLeft aria-hidden="true" className="size-5 text-primary" />
        Faaaaa
      </NavLink>
      <nav aria-label="Primary navigation" className="grid gap-1">
        {items.map(({ icon: Icon, label, to }) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted hover:bg-elevated hover:text-text",
              )
            }
            key={to}
            to={to}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
