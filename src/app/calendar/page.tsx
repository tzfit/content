import { PageHeader } from "@/components/layout/page-header";
import { CalendarDays, Plus, Clock, CheckCircle2, Circle } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const upcomingItems = [
  { title: "No scheduled posts", time: "—", status: "empty" },
];

export default function CalendarPage() {
  return (
    <div>
      <PageHeader
        title="Content Calendar"
        description="Plan, schedule, and organize your content publishing schedule"
      />

      <div className="p-8 space-y-8">
        {/* Calendar grid */}
        <div
          className="rounded-lg border"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          {/* Calendar header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-3">
              <CalendarDays size={18} style={{ color: "#10b981" }} />
              <span className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                March 2026
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
              >
                ← Prev
              </button>
              <button
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
              >
                Today
              </button>
              <button
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 border-b" style={{ borderColor: "var(--border)" }}>
            {days.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells - 5 weeks */}
          {Array.from({ length: 5 }).map((_, weekIdx) => (
            <div
              key={weekIdx}
              className="grid grid-cols-7"
              style={{ borderBottom: weekIdx < 4 ? "1px solid var(--border)" : "none" }}
            >
              {Array.from({ length: 7 }).map((_, dayIdx) => {
                const dayNum = weekIdx * 7 + dayIdx - 5; // March starts on Saturday (idx 5)
                const isValid = dayNum >= 1 && dayNum <= 31;
                const isToday = dayNum === 20;
                return (
                  <div
                    key={dayIdx}
                    className="h-20 p-2 border-r last:border-r-0 relative"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {isValid && (
                      <span
                        className="text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full"
                        style={{
                          color: isToday ? "white" : "var(--muted-foreground)",
                          backgroundColor: isToday ? "#10b981" : "transparent",
                        }}
                      >
                        {dayNum}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Upcoming scheduled */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
              Upcoming Scheduled Posts
            </h2>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium"
              style={{ backgroundColor: "#10b98120", color: "#10b981" }}
            >
              <Plus size={13} />
              New Post
            </button>
          </div>
          <div
            className="rounded-lg border p-6 flex flex-col items-center gap-3"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <Clock size={28} style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              No posts scheduled yet. Create your first scheduled post.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
