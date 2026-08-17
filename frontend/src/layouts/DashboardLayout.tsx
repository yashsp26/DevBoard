import {
  Code2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { UserMenu } from "../components/layout/UserMenu";
import { ThemeToggle } from "../components/layout/ThemeToggle";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: FolderKanban, label: "Projects", to: "/projects" },
  { icon: FileText, label: "Notes", to: "/notes" },
  { icon: Code2, label: "Snippets", to: "/snippets" },
  { icon: UserRound, label: "Profile", to: "/profile" },
];

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/projects": "Projects",
  "/notes": "Notes",
  "/snippets": "Snippets",
};

export function DashboardLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar items={navigationItems} />
      <div className="min-w-0 flex-1 lg:p-4">
        <Navbar
          actions={
            <>
              <ThemeToggle />
              <UserMenu />
            </>
          }
          title={
            pathname.startsWith("/projects/")
              ? "Project details"
              : (routeTitles[pathname] ?? "DevLupo")
          }
        />
        <Outlet />
      </div>
    </div>
  );
}
