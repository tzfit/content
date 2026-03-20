import { PageHeader } from "@/components/layout/page-header";
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

const metrics = [
  { label: "Followers", value: "—", icon: Users, color: "#6366f1" },
  { label: "Impressions", value: "—", icon: Eye, color: "#3b82f6" },
  { label: "Likes", value: "—", icon: Heart, color: "#e1306c" },
  { label: "Comments", value: "—", icon: MessageCircle, color: "#10b981" },
  { label: "Shares", value: "—", icon: Share2, color: "#f59e0b" },
  { label: "Profile Visits", value: "—", icon: TrendingUp, color: "#8b5cf6" },
];

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Track your content performance and audience growth over time"
      />

      <div className="p-8 space-y-8">
        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-lg border p-5"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                    {metric.label}
                  </span>
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: metric.color + "20" }}
                  >
                    <Icon size={15} style={{ color: metric.color }} />
                  </div>
                </div>
                <p className="text-3xl font-semibold" style={{ color: "var(--foreground)" }}>
                  {metric.value}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Connect account to see data
                </p>
              </div>
            );
          })}
        </div>

        {/* Chart placeholder */}
        <div>
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--muted-foreground)" }}>
            Engagement Over Time
          </h2>
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="h-64 rounded-md flex items-center justify-center"
              style={{ backgroundColor: "var(--secondary)" }}
            >
              <div className="text-center">
                <TrendingUp size={32} className="mx-auto mb-2" style={{ color: "var(--muted-foreground)" }} />
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  Chart will appear once data is available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top posts placeholder */}
        <div>
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--muted-foreground)" }}>
            Top Performing Posts
          </h2>
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="h-40 rounded-md flex items-center justify-center"
              style={{ backgroundColor: "var(--secondary)" }}
            >
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                No posts data available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
