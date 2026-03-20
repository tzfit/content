"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Heart,
  BarChart2,
  RefreshCw,
  Instagram,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import {
  getMetricoolData,
  mergeTimeSeries,
  formatShortDate,
  formatLongDate,
  formatNumber,
  PLATFORM_CONFIG,
  MergedRow,
  Platform,
  TopPost,
  PlatformSummary,
} from "@/lib/metricool";
import { cn } from "@/lib/utils";

// ── Constants ──────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: "7D", days: 7 },
  { label: "14D", days: 14 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
] as const;

const PLATFORMS: Array<{ id: Platform | "all"; label: string; color: string }> = [
  { id: "all", label: "All Platforms", color: "#6366f1" },
  { id: "instagram", label: "Instagram", color: PLATFORM_CONFIG.instagram.color },
  { id: "tiktok", label: "TikTok", color: PLATFORM_CONFIG.tiktok.color },
  { id: "twitter", label: "Twitter / X", color: PLATFORM_CONFIG.twitter.color },
];

const CHART_STYLE = {
  cartesianGrid: { stroke: "#1e293b", strokeDasharray: "4 4" },
  axis: { fill: "#64748b", fontSize: 11 },
  tooltip: {
    contentStyle: {
      backgroundColor: "#111827",
      border: "1px solid #1e293b",
      borderRadius: 8,
      color: "#e2e8f0",
      fontSize: 12,
    },
    labelStyle: { color: "#94a3b8", marginBottom: 4 },
    itemStyle: { padding: "1px 0" },
  },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function DeltaBadge({ delta, unit = "%" }: { delta: number; unit?: string }) {
  if (delta === 0)
    return (
      <span className="flex items-center gap-0.5 text-xs" style={{ color: "#64748b" }}>
        <Minus size={11} />
        0{unit}
      </span>
    );
  const positive = delta > 0;
  return (
    <span
      className="flex items-center gap-0.5 text-xs font-medium"
      style={{ color: positive ? "#34d399" : "#f87171" }}
    >
      {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {positive ? "+" : ""}
      {delta}
      {unit}
    </span>
  );
}

function MetricCard({
  label,
  value,
  sub,
  delta,
  deltaUnit,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  delta: number;
  deltaUnit?: string;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {sub}
          </p>
        )}
      </div>
      <DeltaBadge delta={delta} unit={deltaUnit ?? "%"} />
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
        {title}
      </h2>
      {sub && (
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <SectionHeader title={title} sub={sub} />
      {children}
    </div>
  );
}

// ── Tooltip formatters ─────────────────────────────────────────────────────────

function impressionsTickFormatter(v: number) {
  return formatNumber(v);
}

function engTickFormatter(v: number) {
  return `${v}%`;
}

function followerTickFormatter(v: number) {
  return formatNumber(v);
}

function labelFormatterDate(label: unknown) {
  return typeof label === "string" ? formatShortDate(label) : String(label);
}

function fmtPlatformName(name: unknown): string {
  const s = typeof name === "string" ? name : String(name);
  return s.split("_")[0];
}

function fmtImpressionsTooltip(v: unknown, name: unknown): [string, string] {
  return [formatNumber(typeof v === "number" ? v : Number(v)), fmtPlatformName(name)];
}

function fmtEngTooltip(v: unknown, name: unknown): [string, string] {
  return [`${v}%`, fmtPlatformName(name)];
}

function fmtFollowerTooltip(v: unknown, name: unknown): [string, string] {
  return [formatNumber(typeof v === "number" ? v : Number(v)), fmtPlatformName(name)];
}

// ── Platform Stat Row ──────────────────────────────────────────────────────────

function PlatformRow({
  summary,
  selected,
  onClick,
}: {
  summary: PlatformSummary;
  selected: boolean;
  onClick: () => void;
}) {
  const conf = PLATFORM_CONFIG[summary.platform];
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all"
      style={{
        backgroundColor: selected ? conf.color + "12" : "var(--secondary)",
        borderColor: selected ? conf.color + "60" : "var(--border)",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `linear-gradient(135deg, ${conf.gradientFrom}, ${conf.gradientTo})` }}
      >
        <span className="text-white text-xs font-bold">
          {conf.label.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          {conf.label}
        </p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {formatNumber(summary.totalFollowers)} followers
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold" style={{ color: conf.color }}>
          {summary.avgEngagementRate}%
        </p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          engagement
        </p>
      </div>
    </button>
  );
}

// ── Top Posts Table ────────────────────────────────────────────────────────────

const POST_TYPE_LABELS: Record<string, string> = {
  photo: "Photo",
  video: "Video",
  reel: "Reel",
  carousel: "Carousel",
  story: "Story",
};

function TopPostsTable({ posts }: { posts: TopPost[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Platform", "Post", "Type", "Date", "Impressions", "Reach", "Engagement", "Likes", "Comments"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left pb-3 pr-6 text-xs font-medium whitespace-nowrap"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {posts.map((post, i) => {
            const conf = PLATFORM_CONFIG[post.platform];
            return (
              <tr
                key={post.id}
                className="border-b transition-colors hover:bg-white/3"
                style={{ borderColor: i === posts.length - 1 ? "transparent" : "var(--border)" }}
              >
                {/* Platform */}
                <td className="py-3.5 pr-6">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ backgroundColor: conf.color + "20", color: conf.color }}
                  >
                    {conf.label}
                  </span>
                </td>
                {/* Caption */}
                <td className="py-3.5 pr-6 max-w-xs">
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--foreground)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.caption}
                  </p>
                </td>
                {/* Type */}
                <td className="py-3.5 pr-6">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {POST_TYPE_LABELS[post.postType]}
                  </span>
                </td>
                {/* Date */}
                <td className="py-3.5 pr-6 whitespace-nowrap">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {formatLongDate(post.date)}
                  </span>
                </td>
                {/* Impressions */}
                <td className="py-3.5 pr-6">
                  <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                    {formatNumber(post.impressions)}
                  </span>
                </td>
                {/* Reach */}
                <td className="py-3.5 pr-6">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {formatNumber(post.reach)}
                  </span>
                </td>
                {/* Engagement */}
                <td className="py-3.5 pr-6">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#34d399" }}
                  >
                    {post.engagementRate}%
                  </span>
                </td>
                {/* Likes */}
                <td className="py-3.5 pr-6">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {formatNumber(post.likes)}
                  </span>
                </td>
                {/* Comments */}
                <td className="py-3.5">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {formatNumber(post.comments)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export function AnalyticsDashboard() {
  const [days, setDays] = useState(30);
  const [activePlatform, setActivePlatform] = useState<Platform | "all">("all");

  const data = useMemo(() => getMetricoolData(days), [days]);
  const merged = useMemo(() => mergeTimeSeries(data.timeSeries), [data]);

  const platformsToShow: Platform[] =
    activePlatform === "all" ? ["instagram", "tiktok", "twitter"] : [activePlatform];

  // ── Aggregated KPIs across selected platforms ──────────────────────────────
  const kpi = useMemo(() => {
    const sums = platformsToShow.map((p) => data.summaries[p]);
    const totalImpressions = sums.reduce((a, s) => a + s.totalImpressions, 0);
    const totalReach = sums.reduce((a, s) => a + s.totalReach, 0);
    const avgEng =
      Math.round(
        (sums.reduce((a, s) => a + s.avgEngagementRate, 0) / sums.length) * 10
      ) / 10;
    const totalFollowers = sums.reduce((a, s) => a + s.totalFollowers, 0);
    const followerGrowth = sums.reduce((a, s) => a + s.followerGrowth, 0);
    const followerGrowthPct =
      Math.round(
        (sums.reduce((a, s) => a + s.followerGrowthPct, 0) / sums.length) * 10
      ) / 10;
    const impressionsDelta = Math.round(
      sums.reduce((a, s) => a + s.impressionsDelta, 0) / sums.length
    );
    const engDelta = Math.round(
      (sums.reduce((a, s) => a + s.engagementDelta, 0) / sums.length) * 10
    ) / 10;

    return {
      totalImpressions,
      impressionsDelta,
      totalReach,
      avgEng,
      engDelta,
      totalFollowers,
      followerGrowth,
      followerGrowthPct,
    };
  }, [data, platformsToShow]);

  // Thin the merged series for the chart (show at most 30 data points)
  const chartData = useMemo(() => {
    const step = Math.max(1, Math.floor(merged.length / 30));
    return merged.filter((_, i) => i % step === 0 || i === merged.length - 1);
  }, [merged]);

  // Engagement bar chart: per-day avg engagement across selected platforms
  const engChartData = useMemo(() => {
    return chartData.map((row) => {
      const vals = platformsToShow.map((p) => (row[`${p}_engagement`] as number) ?? 0);
      const avg = vals.reduce((a, v) => a + v, 0) / vals.length;
      return {
        date: row.date,
        engagement: Math.round(avg * 10) / 10,
        ...Object.fromEntries(
          platformsToShow.map((p) => [p, Math.round(((row[`${p}_engagement`] as number) ?? 0) * 10) / 10])
        ),
      };
    });
  }, [chartData, platformsToShow]);

  // Filtered top posts
  const topPosts = useMemo(() => {
    let posts = data.topPosts;
    if (activePlatform !== "all") posts = posts.filter((p) => p.platform === activePlatform);
    return [...posts].sort((a, b) => b.engagementRate - a.engagementRate);
  }, [data, activePlatform]);

  const lastUpdated = new Date("2026-03-20T08:42:00").toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-8 py-5 border-b shrink-0 gap-4 flex-wrap"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <BarChart2 size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
              Analytics
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: "#6366f120", color: "#818cf8" }}
              >
                Powered by Metricool
              </span>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                · Updated {lastUpdated}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date presets */}
          <div
            className="flex items-center gap-0.5 p-1 rounded-lg"
            style={{ backgroundColor: "var(--secondary)" }}
          >
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setDays(p.days)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  backgroundColor: days === p.days ? "var(--card)" : "transparent",
                  color: days === p.days ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: days === p.days ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Platform selector */}
          <div
            className="flex items-center gap-0.5 p-1 rounded-lg"
            style={{ backgroundColor: "var(--secondary)" }}
          >
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{
                  backgroundColor: activePlatform === p.id ? p.color + "25" : "transparent",
                  color: activePlatform === p.id ? p.color : "var(--muted-foreground)",
                  boxShadow: activePlatform === p.id ? `0 0 0 1px ${p.color}40` : "none",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-8 space-y-8">
        {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Impressions"
            value={formatNumber(kpi.totalImpressions)}
            sub={`across ${platformsToShow.length} platform${platformsToShow.length > 1 ? "s" : ""}`}
            delta={kpi.impressionsDelta}
            color="#6366f1"
            icon={Eye}
          />
          <MetricCard
            label="Avg Engagement Rate"
            value={`${kpi.avgEng}%`}
            sub="likes + comments + shares / reach"
            delta={kpi.engDelta}
            deltaUnit="pp"
            color="#e1306c"
            icon={Heart}
          />
          <MetricCard
            label="Follower Growth"
            value={`+${formatNumber(kpi.followerGrowth)}`}
            sub={`${formatNumber(kpi.totalFollowers)} total followers`}
            delta={kpi.followerGrowthPct}
            color="#34d399"
            icon={Users}
          />
          <MetricCard
            label="Total Reach"
            value={formatNumber(kpi.totalReach)}
            sub="unique accounts reached"
            delta={Math.round(kpi.impressionsDelta * 0.9)}
            color="#f59e0b"
            icon={TrendingUp}
          />
        </div>

        {/* ── Platform breakdown ────────────────────────────────────────────── */}
        <div>
          <SectionHeader
            title="Platform Breakdown"
            sub="Click to filter all charts and tables"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["instagram", "tiktok", "twitter"] as Platform[]).map((p) => (
              <PlatformRow
                key={p}
                summary={data.summaries[p]}
                selected={activePlatform === p}
                onClick={() =>
                  setActivePlatform((prev) => (prev === p ? "all" : p))
                }
              />
            ))}
          </div>
        </div>

        {/* ── Impressions + Engagement charts ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Impressions line chart (wider) */}
          <div className="lg:col-span-3">
            <ChartCard
              title="Impressions Over Time"
              sub={`Last ${days} days`}
            >
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    {platformsToShow.map((p) => (
                      <linearGradient key={p} id={`grad_imp_${p}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={PLATFORM_CONFIG[p].color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={PLATFORM_CONFIG[p].color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid {...CHART_STYLE.cartesianGrid} vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    tick={CHART_STYLE.axis}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickFormatter={impressionsTickFormatter}
                    tick={CHART_STYLE.axis}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    {...CHART_STYLE.tooltip}
                    labelFormatter={labelFormatterDate}
                    formatter={fmtImpressionsTooltip}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, color: "#64748b", paddingTop: 8 }}
                    formatter={(v) => String(v).split("_")[0]}
                  />
                  {platformsToShow.map((p) => (
                    <Area
                      key={p}
                      type="monotone"
                      dataKey={`${p}_impressions`}
                      name={p}
                      stroke={PLATFORM_CONFIG[p].color}
                      strokeWidth={2}
                      fill={`url(#grad_imp_${p})`}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Engagement bar chart (narrower) */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Engagement Rate"
              sub={activePlatform === "all" ? "avg across platforms" : PLATFORM_CONFIG[activePlatform].label}
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={engChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barSize={activePlatform === "all" ? 4 : 8}>
                  <CartesianGrid {...CHART_STYLE.cartesianGrid} vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    tick={CHART_STYLE.axis}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickFormatter={engTickFormatter}
                    tick={CHART_STYLE.axis}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    {...CHART_STYLE.tooltip}
                    labelFormatter={labelFormatterDate}
                    formatter={fmtEngTooltip}
                  />
                  {activePlatform === "all" ? (
                    <Bar dataKey="engagement" fill="#6366f1" radius={[3, 3, 0, 0]} opacity={0.85} />
                  ) : (
                    <Bar
                      dataKey={activePlatform}
                      fill={PLATFORM_CONFIG[activePlatform].color}
                      radius={[3, 3, 0, 0]}
                      opacity={0.85}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* ── Follower growth chart ─────────────────────────────────────────── */}
        <ChartCard
          title="Follower Growth"
          sub={`Last ${days} days — cumulative followers per platform`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid {...CHART_STYLE.cartesianGrid} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatShortDate}
                tick={CHART_STYLE.axis}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={followerTickFormatter}
                tick={CHART_STYLE.axis}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                {...CHART_STYLE.tooltip}
                labelFormatter={labelFormatterDate}
                formatter={fmtFollowerTooltip}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#64748b", paddingTop: 8 }}
                formatter={(v) => String(v).split("_")[0]}
              />
              {platformsToShow.map((p) => (
                <Line
                  key={p}
                  type="monotone"
                  dataKey={`${p}_followers`}
                  name={p}
                  stroke={PLATFORM_CONFIG[p].color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Top Posts ─────────────────────────────────────────────────────── */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-3">
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Top Performing Posts
              </h2>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                sorted by engagement rate
              </span>
            </div>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}
            >
              {topPosts.length} post{topPosts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {topPosts.length > 0 ? (
            <TopPostsTable posts={topPosts} />
          ) : (
            <div
              className="flex items-center justify-center h-28 rounded-lg"
              style={{ backgroundColor: "var(--secondary)" }}
            >
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                No posts for the selected platform
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
