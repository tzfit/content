"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Crosshair,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Repeat2,
  Eye,
  MessageCircle,
  X,
  AlertCircle,
  Check,
} from "lucide-react";
import {
  SEED_COMPETITORS,
  COMP_PLATFORM_CONFIG,
  POST_TYPE_LABELS,
  COMPETITOR_COLORS,
  Competitor,
  CompPlatform,
  CompAccount,
  createMockCompetitor,
  formatNum,
  formatDate,
} from "@/lib/competitor-data";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

type SortKey = "name" | "platform" | "followers" | "engagement" | "postsPerWeek" | "growth";
type SortDir = "asc" | "desc";
type CompareMetric = "followers" | "engagement" | "postsPerWeek" | "growth";

interface FlatRow {
  competitorId: string;
  competitorName: string;
  color: string;
  account: CompAccount;
  rowKey: string;
}

const ALL_PLATFORMS = Object.keys(COMP_PLATFORM_CONFIG) as CompPlatform[];

// ── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => ({ i, v }));
  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? "#34d399" : "#f87171";
  return (
    <LineChart width={80} height={30} data={pts} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
      <Line
        type="monotone"
        dataKey="v"
        stroke={lineColor}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  );
}

// ── Delta badge ───────────────────────────────────────────────────────────────

function Delta({ value, unit = "%" }: { value: number; unit?: string }) {
  const pos = value >= 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-medium"
      style={{ color: pos ? "#34d399" : "#f87171" }}
    >
      {pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {pos ? "+" : ""}{value}{unit}
    </span>
  );
}

// ── Sort header button ─────────────────────────────────────────────────────────

function SortTh({
  label,
  sortKey,
  current,
  dir,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = current === sortKey;
  return (
    <th
      className={cn("px-4 py-3 text-left cursor-pointer select-none whitespace-nowrap", className)}
      onClick={() => onSort(sortKey)}
    >
      <span
        className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
        style={{ color: active ? "var(--foreground)" : "var(--muted-foreground)" }}
      >
        {label}
        {active ? (
          dir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />
        ) : (
          <ArrowUpDown size={11} style={{ opacity: 0.4 }} />
        )}
      </span>
    </th>
  );
}

// ── Recent posts expand panel ─────────────────────────────────────────────────

function RecentPostsPanel({ account, color }: { account: CompAccount; color: string }) {
  return (
    <div
      className="px-5 pb-4 pt-1"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      <p className="text-xs font-medium mb-3" style={{ color: "var(--muted-foreground)" }}>
        Recent posts · {COMP_PLATFORM_CONFIG[account.platform].label}
      </p>
      <div className="grid grid-cols-1 gap-2">
        {account.recentPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-start gap-3 rounded-lg px-3.5 py-2.5 border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {/* Date + type */}
            <div className="shrink-0 text-right w-20">
              <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                {formatDate(post.date)}
              </p>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block"
                style={{ backgroundColor: color + "20", color }}
              >
                {POST_TYPE_LABELS[post.type]}
              </span>
            </div>

            {/* Divider */}
            <div
              className="w-0.5 self-stretch rounded-full shrink-0"
              style={{ backgroundColor: color + "60" }}
            />

            {/* Caption */}
            <p
              className="flex-1 text-xs leading-relaxed"
              style={{
                color: "var(--foreground)",
                opacity: 0.9,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.caption}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-3 shrink-0">
              {post.views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye size={11} style={{ color: "var(--muted-foreground)" }} />
                  <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    {formatNum(post.views)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Heart size={11} style={{ color: "#e1306c" }} />
                <span className="text-[11px]" style={{ color: "var(--foreground)" }}>
                  {formatNum(post.likes)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={11} style={{ color: "var(--muted-foreground)" }} />
                <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  {formatNum(post.comments)}
                </span>
              </div>
              <span
                className="text-[11px] font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "#34d39920", color: "#34d399" }}
              >
                {post.engagementRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Add competitor modal ───────────────────────────────────────────────────────

interface AddForm {
  name: string;
  entries: Array<{ platform: CompPlatform; handle: string }>;
}

const EMPTY_FORM: AddForm = { name: "", entries: [{ platform: "instagram", handle: "" }] };

function AddCompetitorModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (f: AddForm) => void;
}) {
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) { setForm(EMPTY_FORM); setErrors([]); setTimeout(() => nameRef.current?.focus(), 60); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  function validate(): boolean {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push("Brand name is required.");
    if (form.entries.every(e => !e.handle.trim())) errs.push("At least one handle is required.");
    const dupes = new Set<CompPlatform>();
    form.entries.forEach(e => {
      if (dupes.has(e.platform)) errs.push(`Duplicate platform: ${COMP_PLATFORM_CONFIG[e.platform].label}`);
      dupes.add(e.platform);
    });
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSubmit() { if (validate()) onAdd(form); }

  function addEntry() {
    const used = new Set(form.entries.map(e => e.platform));
    const next = ALL_PLATFORMS.find(p => !used.has(p));
    if (!next) return;
    setForm(f => ({ ...f, entries: [...f.entries, { platform: next, handle: "" }] }));
  }

  function removeEntry(i: number) {
    setForm(f => ({ ...f, entries: f.entries.filter((_, idx) => idx !== i) }));
  }

  function updateEntry(i: number, key: "platform" | "handle", val: string) {
    setForm(f => ({
      ...f,
      entries: f.entries.map((e, idx) =>
        idx === i ? { ...e, [key]: val } : e
      ),
    }));
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col shadow-2xl"
        style={{ backgroundColor: "#0d1117", borderLeft: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="font-semibold text-base" style={{ color: "var(--foreground)" }}>Track New Competitor</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Add their social accounts to start monitoring</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5" style={{ color: "var(--muted-foreground)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Brand name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium" style={{ color: "var(--foreground)" }}>
              Brand / Competitor Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              placeholder="e.g. DriftCo"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
              style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              onFocus={e => (e.target.style.borderColor = "#f59e0b")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Platform accounts */}
          <div className="space-y-2">
            <label className="block text-xs font-medium" style={{ color: "var(--foreground)" }}>
              Social Accounts
            </label>
            {form.entries.map((entry, i) => {
              const conf = COMP_PLATFORM_CONFIG[entry.platform];
              return (
                <div key={i} className="flex items-center gap-2">
                  {/* Platform selector */}
                  <div className="relative">
                    <select
                      value={entry.platform}
                      onChange={e => updateEntry(i, "platform", e.target.value)}
                      className="appearance-none pl-3 pr-7 py-2.5 rounded-lg text-xs font-medium outline-none cursor-pointer w-32"
                      style={{
                        backgroundColor: conf.color + "20",
                        color: conf.color,
                        border: `1px solid ${conf.color}50`,
                      }}
                    >
                      {ALL_PLATFORMS.map(p => (
                        <option key={p} value={p} style={{ backgroundColor: "#111827", color: "#e2e8f0" }}>
                          {COMP_PLATFORM_CONFIG[p].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Handle */}
                  <input
                    type="text"
                    placeholder={`@handle`}
                    value={entry.handle}
                    onChange={e => updateEntry(i, "handle", e.target.value)}
                    className="flex-1 rounded-lg px-3 py-2.5 text-sm outline-none"
                    style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                    onFocus={e => (e.target.style.borderColor = conf.color)}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")}
                  />
                  {/* Remove */}
                  {form.entries.length > 1 && (
                    <button onClick={() => removeEntry(i)} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5" style={{ color: "var(--muted-foreground)" }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              );
            })}
            {form.entries.length < ALL_PLATFORMS.length && (
              <button
                onClick={addEntry}
                className="flex items-center gap-1.5 text-xs font-medium mt-1 transition-colors hover:opacity-80"
                style={{ color: "#f59e0b" }}
              >
                <Plus size={13} /> Add another platform
              </button>
            )}
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="space-y-1">
              {errors.map((e, i) => (
                <p key={i} className="flex items-center gap-1.5 text-xs" style={{ color: "#f87171" }}>
                  <AlertCircle size={12} /> {e}
                </p>
              ))}
            </div>
          )}

          {/* Info note */}
          <div className="rounded-lg px-3.5 py-3 text-xs leading-relaxed" style={{ backgroundColor: "#f59e0b10", border: "1px solid #f59e0b20", color: "#fbbf24" }}>
            <strong>Public data only.</strong> This tracker fetches publicly available profile info — followers, engagement rates, posting frequency — from each platform's public-facing data.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5" style={{ color: "var(--muted-foreground)" }}>
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: "#f59e0b", color: "black" }}>
            <Check size={15} /> Track Competitor
          </button>
        </div>
      </div>
    </>
  );
}

// ── Compare chart ─────────────────────────────────────────────────────────────

const METRIC_LABELS: Record<CompareMetric, { label: string; unit: string }> = {
  followers: { label: "Followers", unit: "" },
  engagement: { label: "Engagement Rate", unit: "%" },
  postsPerWeek: { label: "Posts / Week", unit: "" },
  growth: { label: "30D Growth", unit: "%" },
};

function CompareChart({ rows, metric }: { rows: FlatRow[]; metric: CompareMetric }) {
  const data = rows.map(r => ({
    key: `${r.competitorName} (${COMP_PLATFORM_CONFIG[r.account.platform].abbr})`,
    value: metric === "followers" ? r.account.followers
      : metric === "engagement" ? r.account.engagementRate
      : metric === "postsPerWeek" ? r.account.postsPerWeek
      : r.account.followerGrowthPct30d,
    color: r.color,
  })).sort((a, b) => b.value - a.value).slice(0, 12);

  const { unit } = METRIC_LABELS[metric];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 60, left: 8 }} barSize={18}>
        <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="key"
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          angle={-40}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={44}
          tickFormatter={v => metric === "followers" ? formatNum(v) : `${v}${unit}`}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0", fontSize: 12 }}
          formatter={(v: unknown) => [`${metric === "followers" ? formatNum(Number(v)) : v}${unit}`, METRIC_LABELS[metric].label] as [string, string]}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} opacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export function CompetitorTracker() {
  const [competitors, setCompetitors] = useState<Competitor[]>(SEED_COMPETITORS);
  const [sortKey, setSortKey] = useState<SortKey>("followers");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<CompPlatform | "all">("all");
  const [compareMetric, setCompareMetric] = useState<CompareMetric>("engagement");
  const [modalOpen, setModalOpen] = useState(false);

  // Build flat rows
  const flatRows = useMemo<FlatRow[]>(() => {
    const rows: FlatRow[] = [];
    for (const comp of competitors) {
      for (const acc of comp.accounts) {
        if (filterPlatform !== "all" && acc.platform !== filterPlatform) continue;
        rows.push({
          competitorId: comp.id,
          competitorName: comp.name,
          color: comp.color,
          account: acc,
          rowKey: `${comp.id}-${acc.platform}`,
        });
      }
    }
    return rows;
  }, [competitors, filterPlatform]);

  // Sorted rows
  const sortedRows = useMemo(() => {
    return [...flatRows].sort((a, b) => {
      let av = 0, bv = 0;
      switch (sortKey) {
        case "name": return sortDir === "asc"
          ? a.competitorName.localeCompare(b.competitorName)
          : b.competitorName.localeCompare(a.competitorName);
        case "platform": return sortDir === "asc"
          ? a.account.platform.localeCompare(b.account.platform)
          : b.account.platform.localeCompare(a.account.platform);
        case "followers": av = a.account.followers; bv = b.account.followers; break;
        case "engagement": av = a.account.engagementRate; bv = b.account.engagementRate; break;
        case "postsPerWeek": av = a.account.postsPerWeek; bv = b.account.postsPerWeek; break;
        case "growth": av = a.account.followerGrowthPct30d; bv = b.account.followerGrowthPct30d; break;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [flatRows, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  function removeCompetitor(id: string) {
    setCompetitors(prev => prev.filter(c => c.id !== id));
    setExpandedRow(null);
  }

  function handleAdd(form: { name: string; entries: Array<{ platform: CompPlatform; handle: string }> }) {
    const colorIdx = competitors.length;
    const filled = form.entries.filter(e => e.handle.trim());
    const comp = createMockCompetitor(form.name.trim(), filled, colorIdx);
    setCompetitors(prev => [...prev, comp]);
    setModalOpen(false);
  }

  // Summary stats
  const totalAccounts = flatRows.length;
  const avgEngagement = flatRows.length
    ? Math.round((flatRows.reduce((a, r) => a + r.account.engagementRate, 0) / flatRows.length) * 10) / 10
    : 0;
  const topGrower = [...flatRows].sort((a, b) => b.account.followerGrowthPct30d - a.account.followerGrowthPct30d)[0];

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-8 py-5 border-b shrink-0 gap-4 flex-wrap" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
            <Crosshair size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>Competitor Tracker</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {competitors.length} competitor{competitors.length !== 1 ? "s" : ""} · {totalAccounts} account{totalAccounts !== 1 ? "s" : ""} tracked
            </p>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)", color: "white" }}
        >
          <Plus size={15} /> Add Competitor
        </button>
      </div>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
        {[
          {
            label: "Competitors tracked",
            value: competitors.length.toString(),
            sub: `${totalAccounts} accounts across ${new Set(flatRows.map(r => r.account.platform)).size} platforms`,
            color: "#f59e0b",
            icon: Crosshair,
          },
          {
            label: "Avg engagement rate",
            value: `${avgEngagement}%`,
            sub: "across all tracked accounts",
            color: "#e1306c",
            icon: Heart,
          },
          {
            label: "Fastest growing",
            value: topGrower ? topGrower.competitorName : "—",
            sub: topGrower ? `${COMP_PLATFORM_CONFIG[topGrower.account.platform].label} +${topGrower.account.followerGrowthPct30d}% in 30d` : "Add competitors",
            color: "#34d399",
            icon: TrendingUp,
          },
        ].map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 px-6 py-4 border-r last:border-r-0" style={{ borderColor: "var(--border)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + "20" }}>
              <Icon size={15} style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-bold leading-none" style={{ color }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-8 py-3 border-b shrink-0 gap-4 flex-wrap" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs mr-1" style={{ color: "var(--muted-foreground)" }}>Platform:</span>
          {([["all", "All", "#6366f1"], ...ALL_PLATFORMS.map(p => [p, COMP_PLATFORM_CONFIG[p].label, COMP_PLATFORM_CONFIG[p].color])] as [string, string, string][]).map(([id, label, color]) => {
            const active = filterPlatform === id;
            return (
              <button
                key={id}
                onClick={() => setFilterPlatform(id as CompPlatform | "all")}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={{
                  backgroundColor: active ? color + "20" : "transparent",
                  borderColor: active ? color + "60" : "var(--border)",
                  color: active ? color : "var(--muted-foreground)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {sortedRows.length} account{sortedRows.length !== 1 ? "s" : ""} · click any row to expand recent posts
        </p>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-8 space-y-8">
        {/* ── Table ─────────────────────────────────────────────────────── */}
        {sortedRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f59e0b20, #f9731620)" }}>
              <Crosshair size={28} style={{ color: "#f59e0b" }} />
            </div>
            <div className="text-center">
              <p className="font-semibold" style={{ color: "var(--foreground)" }}>No competitors tracked yet</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Add a competitor to start monitoring their social performance.</p>
            </div>
            <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: "#f59e0b", color: "black" }}>
              <Plus size={15} /> Add Competitor
            </button>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "#0d1117" }}>
                  <SortTh label="Competitor" sortKey="name" current={sortKey} dir={sortDir} onSort={handleSort} className="pl-5" />
                  <SortTh label="Platform" sortKey="platform" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Followers" sortKey="followers" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Engagement" sortKey="engagement" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Posts / Week" sortKey="postsPerWeek" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="30D Growth" sortKey="growth" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Trend</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Last Post</th>
                  <th className="px-4 py-3 w-16" />
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => {
                  const conf = COMP_PLATFORM_CONFIG[row.account.platform];
                  const isExpanded = expandedRow === row.rowKey;
                  const growthPos = row.account.followerGrowthPct30d >= 0;
                  return (
                    <>
                      <tr
                        key={row.rowKey}
                        className="border-b cursor-pointer transition-colors hover:bg-white/3"
                        style={{ borderColor: "var(--border)" }}
                        onClick={() => setExpandedRow(isExpanded ? null : row.rowKey)}
                      >
                        {/* Competitor name */}
                        <td className="px-4 pl-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                            <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{row.competitorName}</span>
                          </div>
                        </td>
                        {/* Platform */}
                        <td className="px-4 py-3.5">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: conf.color + "20", color: conf.color }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: conf.color }} />
                            {conf.label}
                          </span>
                        </td>
                        {/* Followers */}
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                            {formatNum(row.account.followers)}
                          </span>
                        </td>
                        {/* Engagement */}
                        <td className="px-4 py-3.5">
                          <span
                            className="text-sm font-semibold px-2 py-0.5 rounded"
                            style={{ backgroundColor: "#34d39920", color: "#34d399" }}
                          >
                            {row.account.engagementRate}%
                          </span>
                        </td>
                        {/* Posts/week */}
                        <td className="px-4 py-3.5">
                          <span className="text-sm" style={{ color: "var(--foreground)" }}>{row.account.postsPerWeek}×</span>
                        </td>
                        {/* Growth */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-0.5">
                            <Delta value={row.account.followerGrowthPct30d} />
                            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                              {growthPos ? "+" : ""}{formatNum(row.account.followerGrowth30d)} followers
                            </span>
                          </div>
                        </td>
                        {/* Sparkline */}
                        <td className="px-4 py-3.5">
                          <Sparkline data={row.account.sparkline} color={row.color} />
                        </td>
                        {/* Last post */}
                        <td className="px-4 py-3.5">
                          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{formatDate(row.account.lastPosted)}</span>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            {isExpanded
                              ? <ChevronUp size={15} style={{ color: "var(--muted-foreground)" }} />
                              : <ChevronDown size={15} style={{ color: "var(--muted-foreground)" }} />}
                            <button
                              onClick={e => { e.stopPropagation(); removeCompetitor(row.competitorId); }}
                              className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-red-500/10 ml-1"
                              style={{ color: "var(--muted-foreground)" }}
                              title="Remove competitor"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Expanded recent posts */}
                      {isExpanded && (
                        <tr key={`${row.rowKey}-expand`} className="border-b" style={{ borderColor: "var(--border)" }}>
                          <td colSpan={9} className="p-0">
                            <RecentPostsPanel account={row.account} color={row.color} />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Comparison chart ──────────────────────────────────────────── */}
        {sortedRows.length > 0 && (
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Competitive Comparison</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Compare all tracked accounts side-by-side</p>
              </div>
              {/* Metric tabs */}
              <div className="flex items-center gap-0.5 p-1 rounded-lg" style={{ backgroundColor: "var(--secondary)" }}>
                {(Object.keys(METRIC_LABELS) as CompareMetric[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setCompareMetric(m)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: compareMetric === m ? "var(--card)" : "transparent",
                      color: compareMetric === m ? "var(--foreground)" : "var(--muted-foreground)",
                    }}
                  >
                    {METRIC_LABELS[m].label}
                  </button>
                ))}
              </div>
            </div>
            <CompareChart rows={sortedRows} metric={compareMetric} />
          </div>
        )}
      </div>

      {/* ── Add modal ─────────────────────────────────────────────────────── */}
      <AddCompetitorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  );
}
