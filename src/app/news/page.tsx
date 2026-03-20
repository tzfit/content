import { PageHeader } from "@/components/layout/page-header";
import { Newspaper, Rss, Tag, ExternalLink } from "lucide-react";

const categories = [
  { label: "All", count: 0 },
  { label: "Social Media", count: 0 },
  { label: "Marketing", count: 0 },
  { label: "Industry", count: 0 },
  { label: "Tech", count: 0 },
];

const sources = [
  { name: "Social Media Today", url: "#", category: "Social Media" },
  { name: "Marketing Week", url: "#", category: "Marketing" },
  { name: "TechCrunch", url: "#", category: "Tech" },
];

export default function NewsPage() {
  return (
    <div>
      <PageHeader
        title="News Consolidator"
        description="Aggregate and browse the latest news from your chosen sources and topics"
      />

      <div className="p-8 flex gap-6">
        {/* Sidebar: sources & filters */}
        <div className="w-56 shrink-0 space-y-6">
          {/* Categories */}
          <div>
            <p className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Categories
            </p>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-left transition-colors"
                  style={{
                    backgroundColor: cat.label === "All" ? "var(--secondary)" : "transparent",
                    color: cat.label === "All" ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div>
            <p className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Sources
            </p>
            <div className="space-y-2">
              {sources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-start gap-2 px-3 py-2 rounded-md"
                  style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <Rss size={13} className="mt-0.5 shrink-0" style={{ color: "#3b82f6" }} />
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{source.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{source.category}</p>
                  </div>
                </div>
              ))}
              <button
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border border-dashed"
                style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
              >
                + Add Source
              </button>
            </div>
          </div>
        </div>

        {/* Main: news feed */}
        <div className="flex-1 space-y-4">
          <div
            className="rounded-lg border border-dashed p-12 flex flex-col items-center gap-4 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#3b82f620" }}
            >
              <Newspaper size={26} style={{ color: "#3b82f6" }} />
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--foreground)" }}>
                No news articles yet
              </p>
              <p className="text-sm mt-1 max-w-sm" style={{ color: "var(--muted-foreground)" }}>
                Add RSS feed sources or configure your topics to start pulling in relevant news articles.
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
              style={{ backgroundColor: "#3b82f6", color: "white" }}
            >
              <Rss size={15} />
              Configure Sources
            </button>
          </div>

          {/* Example article skeleton */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg border p-5 flex items-start gap-4"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div
                className="w-20 h-16 rounded-md shrink-0"
                style={{ backgroundColor: "var(--secondary)" }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-4 rounded w-3/4"
                  style={{ backgroundColor: "var(--secondary)" }}
                />
                <div
                  className="h-3 rounded w-full"
                  style={{ backgroundColor: "var(--secondary)" }}
                />
                <div
                  className="h-3 rounded w-1/2"
                  style={{ backgroundColor: "var(--secondary)" }}
                />
                <div className="flex items-center gap-3 pt-1">
                  <div
                    className="h-3 rounded w-20"
                    style={{ backgroundColor: "var(--secondary)" }}
                  />
                  <div
                    className="h-3 rounded w-16"
                    style={{ backgroundColor: "var(--secondary)" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
