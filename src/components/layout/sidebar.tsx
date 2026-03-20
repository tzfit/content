"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Instagram,
  BarChart2,
  CalendarDays,
  Crosshair,
  Newspaper,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Instagram Manager",
    href: "/instagram",
    icon: Instagram,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    label: "Content Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    label: "Competitor Tracker",
    href: "/competitors",
    icon: Crosshair,
  },
  {
    label: "News Consolidator",
    href: "/news",
    icon: Newspaper,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-60 min-h-screen border-r shrink-0"
      style={{
        backgroundColor: "var(--sidebar)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-16 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <LayoutDashboard size={15} color="white" />
        </div>
        <span className="font-semibold text-sm tracking-tight" style={{ color: "var(--foreground)" }}>
          CMS Dashboard
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        <p className="px-3 pt-2 pb-1 text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "text-white"
                  : "hover:text-white"
              )}
              style={{
                backgroundColor: isActive ? "var(--sidebar-active)" : "transparent",
                color: isActive ? "var(--sidebar-active-foreground)" : "var(--sidebar-foreground)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--sidebar-hover)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--sidebar-foreground)";
                }
              }}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-xs" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
        <p>Content Manager v1.0</p>
      </div>
    </aside>
  );
}
