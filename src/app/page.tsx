import { PageHeader } from "@/components/layout/page-header";
import {
  Instagram,
  BarChart2,
  CalendarDays,
  Crosshair,
  Newspaper,
  TrendingUp,
  Users,
  FileText,
  Activity,
} from "lucide-react";

const stats = [
  { label: "Total Posts", value: "—", icon: FileText, change: "Connect Instagram" },
  { label: "Total Reach", value: "—", icon: Users, change: "No data yet" },
  { label: "Engagement Rate", value: "—", icon: TrendingUp, change: "No data yet" },
  { label: "Scheduled Posts", value: "0", icon: Activity, change: "None scheduled" },
];

const sections = [
  {
    icon: Instagram,
    label: "Instagram Manager",
    href: "/instagram",
    description: "Manage posts, stories, and reels",
    color: "#e1306c",
  },
  {
    icon: BarChart2,
    label: "Analytics",
    href: "/analytics",
    description: "Track engagement and growth metrics",
    color: "#6366f1",
  },
  {
    icon: CalendarDays,
    label: "Content Calendar",
    href: "/calendar",
    description: "Plan and schedule your content",
    color: "#10b981",
  },
  {
    icon: Crosshair,
    label: "Competitor Tracker",
    href: "/competitors",
    description: "Monitor competitor activity",
    color: "#f59e0b",
  },
  {
    icon: Newspaper,
    label: "News Consolidator",
    href: "/news",
    description: "Stay up to date with industry news",
    color: "#3b82f6",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome to your content management dashboard"
      />

      <div className="p-8 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-lg border p-5"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                    {stat.label}
                  </span>
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: "var(--secondary)" }}
                  >
                    <Icon size={15} style={{ color: "var(--primary)" }} />
                  </div>
                </div>
                <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
                  {stat.value}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  {stat.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Section cards */}
        <div>
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--muted-foreground)" }}>
            Sections
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.href}
                  href={section.href}
                  className="rounded-lg border p-5 flex items-start gap-4 transition-colors"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: section.color + "20" }}
                  >
                    <Icon size={20} style={{ color: section.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                      {section.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {section.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
