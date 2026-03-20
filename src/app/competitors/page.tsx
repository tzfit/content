import { PageHeader } from "@/components/layout/page-header";
import { Crosshair, Plus, TrendingUp, Users, Eye } from "lucide-react";

const exampleCompetitors = [
  { handle: "@competitor_one", followers: "—", engagement: "—", posts: "—" },
  { handle: "@competitor_two", followers: "—", engagement: "—", posts: "—" },
];

export default function CompetitorsPage() {
  return (
    <div>
      <PageHeader
        title="Competitor Tracker"
        description="Monitor competitor Instagram accounts and benchmark your performance"
      />

      <div className="p-8 space-y-8">
        {/* Add competitor */}
        <div
          className="rounded-lg border p-6 flex items-center gap-5"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#f59e0b20" }}
          >
            <Crosshair size={22} style={{ color: "#f59e0b" }} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
              Track a Competitor
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Enter an Instagram handle to start monitoring their content and engagement.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="@handle"
              className="px-3 py-2 rounded-md text-sm outline-none w-40"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium"
              style={{ backgroundColor: "#f59e0b", color: "white" }}
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>

        {/* Competitor table */}
        <div>
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--muted-foreground)" }}>
            Tracked Accounts
          </h2>
          <div
            className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-5 px-5 py-3 border-b text-xs font-medium"
              style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              <div>Account</div>
              <div className="flex items-center gap-1.5">
                <Users size={12} /> Followers
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={12} /> Engagement
              </div>
              <div className="flex items-center gap-1.5">
                <Eye size={12} /> Posts / Week
              </div>
              <div>Actions</div>
            </div>

            {/* Table rows */}
            {exampleCompetitors.map((competitor, i) => (
              <div
                key={competitor.handle}
                className="grid grid-cols-5 px-5 py-4 items-center text-sm border-b last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "#f59e0b20", color: "#f59e0b" }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ color: "var(--foreground)" }}>{competitor.handle}</span>
                </div>
                <span style={{ color: "var(--muted-foreground)" }}>{competitor.followers}</span>
                <span style={{ color: "var(--muted-foreground)" }}>{competitor.engagement}</span>
                <span style={{ color: "var(--muted-foreground)" }}>{competitor.posts}</span>
                <button
                  className="text-xs px-3 py-1 rounded-md w-fit"
                  style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison chart placeholder */}
        <div>
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--muted-foreground)" }}>
            Engagement Comparison
          </h2>
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="h-52 rounded-md flex items-center justify-center"
              style={{ backgroundColor: "var(--secondary)" }}
            >
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Add competitors to see comparison charts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
