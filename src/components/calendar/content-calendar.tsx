"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";
import {
  CALENDAR_POSTS,
  CAL_PLATFORM_CONFIG,
  POST_TYPE_LABELS,
  CalendarPost,
  CalPlatform,
  buildPostsByDate,
  toDateString,
  formatMonthYear,
  formatDisplayDate,
  format12hTime,
} from "@/lib/calendar-data";
import { cn } from "@/lib/utils";

// ── Constants ──────────────────────────────────────────────────────────────────

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ALL_PLATFORMS = Object.keys(CAL_PLATFORM_CONFIG) as CalPlatform[];
const TODAY = "2026-03-20";
const TODAY_YEAR = 2026;
const TODAY_MONTH = 2; // 0-indexed (March)
const TODAY_DAY = 20;

const STATUS_CONFIG = {
  published: { label: "Published", color: "#34d399", Icon: CheckCircle2 },
  scheduled: { label: "Scheduled", color: "#818cf8", Icon: Clock3 },
  draft: { label: "Draft", color: "#94a3b8", Icon: FileText },
};

// ── Chip ───────────────────────────────────────────────────────────────────────

function PostChip({ post }: { post: CalendarPost }) {
  const conf = CAL_PLATFORM_CONFIG[post.platform];
  return (
    <div
      className="flex items-center gap-1 px-1.5 rounded text-xs leading-5 min-w-0 overflow-hidden"
      style={{
        backgroundColor: conf.color + "22",
        borderLeft: `2px solid ${conf.color}`,
      }}
    >
      <span className="font-bold shrink-0 text-[10px]" style={{ color: conf.color }}>
        {conf.abbr}
      </span>
      <span
        className="truncate"
        style={{ color: "var(--foreground)", opacity: 0.85, fontSize: 10 }}
      >
        {post.title}
      </span>
      {post.status === "scheduled" && (
        <Clock3 size={8} className="shrink-0 ml-auto" style={{ color: conf.color }} />
      )}
    </div>
  );
}

// ── Day cell ───────────────────────────────────────────────────────────────────

const MAX_VISIBLE_CHIPS = 3;

function DayCell({
  day,
  dateStr,
  isCurrentMonth,
  isToday,
  isSelected,
  posts,
  onClick,
}: {
  day: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  posts: CalendarPost[];
  onClick: () => void;
}) {
  const visible = posts.slice(0, MAX_VISIBLE_CHIPS);
  const overflow = posts.length - MAX_VISIBLE_CHIPS;
  const isWeekend = (() => {
    const d = new Date(dateStr + "T00:00:00");
    return d.getDay() === 0 || d.getDay() === 6;
  })();

  return (
    <button
      onClick={onClick}
      className="relative flex flex-col gap-0.5 p-1.5 text-left transition-colors border-r border-b last:border-r-0 min-h-0"
      style={{
        height: 110,
        borderColor: "var(--border)",
        backgroundColor: isSelected
          ? "#6366f108"
          : isToday
          ? "#10b98108"
          : isWeekend && isCurrentMonth
          ? "#ffffff04"
          : "transparent",
        outline: isSelected ? "1px solid #6366f130" : "none",
        outlineOffset: "-1px",
        opacity: isCurrentMonth ? 1 : 0.35,
      }}
    >
      {/* Day number */}
      <span
        className="text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full shrink-0 self-end"
        style={{
          color: isToday ? "white" : "var(--muted-foreground)",
          backgroundColor: isToday ? "#10b981" : "transparent",
          fontWeight: isToday ? 700 : 500,
        }}
      >
        {day}
      </span>

      {/* Chips */}
      <div className="flex flex-col gap-0.5 w-full min-w-0 flex-1 overflow-hidden">
        {visible.map((post) => (
          <PostChip key={post.id} post={post} />
        ))}
        {overflow > 0 && (
          <span
            className="text-[10px] px-1.5 font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            +{overflow} more
          </span>
        )}
      </div>
    </button>
  );
}

// ── Detail panel ───────────────────────────────────────────────────────────────

function DetailPanel({
  dateStr,
  posts,
  onClose,
}: {
  dateStr: string;
  posts: CalendarPost[];
  onClose: () => void;
}) {
  const sorted = [...posts].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div
      className="rounded-xl border mt-4 overflow-hidden"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <CalendarDays size={15} style={{ color: "#10b981" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {formatDisplayDate(dateStr)}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}
          >
            {sorted.length} post{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "var(--muted-foreground)" }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Post list */}
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {sorted.map((post) => {
          const conf = CAL_PLATFORM_CONFIG[post.platform];
          const st = STATUS_CONFIG[post.status];
          const StIcon = st.Icon;
          return (
            <div
              key={post.id}
              className="flex items-start gap-4 px-5 py-4"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Time column */}
              <div className="shrink-0 w-14 text-right">
                <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {format12hTime(post.time)}
                </span>
              </div>

              {/* Colored rule */}
              <div
                className="w-0.5 self-stretch rounded-full shrink-0 mt-0.5"
                style={{ backgroundColor: conf.color }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {/* Platform badge */}
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: conf.color + "22",
                      color: conf.color,
                    }}
                  >
                    {conf.label}
                  </span>
                  {/* Post type */}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: "var(--secondary)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {POST_TYPE_LABELS[post.postType]}
                  </span>
                  {/* Status */}
                  <span
                    className="flex items-center gap-1 text-xs font-medium ml-auto"
                    style={{ color: st.color }}
                  >
                    <StIcon size={11} />
                    {st.label}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "var(--foreground)" }}>
                  {post.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Platform filter bar ────────────────────────────────────────────────────────

function PlatformFilterBar({
  active,
  onToggle,
  onAll,
}: {
  active: Set<CalPlatform>;
  onToggle: (p: CalPlatform) => void;
  onAll: () => void;
}) {
  const allActive = active.size === ALL_PLATFORMS.length;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={onAll}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
        style={{
          backgroundColor: allActive ? "#6366f120" : "var(--secondary)",
          borderColor: allActive ? "#6366f160" : "var(--border)",
          color: allActive ? "#818cf8" : "var(--muted-foreground)",
        }}
      >
        All
      </button>
      {ALL_PLATFORMS.map((p) => {
        const conf = CAL_PLATFORM_CONFIG[p];
        const isOn = active.has(p);
        return (
          <button
            key={p}
            onClick={() => onToggle(p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
            style={{
              backgroundColor: isOn ? conf.color + "20" : "var(--secondary)",
              borderColor: isOn ? conf.color + "60" : "var(--border)",
              color: isOn ? conf.color : "var(--muted-foreground)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: isOn ? conf.color : "var(--muted-foreground)" }}
            />
            {conf.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Post count legend ──────────────────────────────────────────────────────────

function MonthStats({ posts }: { posts: CalendarPost[] }) {
  const published = posts.filter((p) => p.status === "published").length;
  const scheduled = posts.filter((p) => p.status === "scheduled").length;
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <CheckCircle2 size={13} style={{ color: "#34d399" }} />
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {published} published
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock3 size={13} style={{ color: "#818cf8" }} />
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {scheduled} scheduled
        </span>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ContentCalendar() {
  const [year, setYear] = useState(TODAY_YEAR);
  const [month, setMonth] = useState(TODAY_MONTH); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string | null>(TODAY);
  const [activePlatforms, setActivePlatforms] = useState<Set<CalPlatform>>(
    new Set(ALL_PLATFORMS)
  );

  // Build lookup from ALL posts filtered by active platforms
  const filteredPosts = useMemo(
    () => CALENDAR_POSTS.filter((p) => activePlatforms.has(p.platform)),
    [activePlatforms]
  );
  const postsByDate = useMemo(() => buildPostsByDate(filteredPosts), [filteredPosts]);

  // Calendar grid computation
  const { cells, daysInMonth } = useMemo(() => {
    const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
    const dim = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstDow + dim) / 7) * 7;
    const cells = Array.from({ length: totalCells }, (_, i) => {
      const dayNum = i - firstDow + 1;
      const isCurrentMonth = dayNum >= 1 && dayNum <= dim;
      const dateStr = isCurrentMonth ? toDateString(year, month, dayNum) : "";
      return { dayNum, isCurrentMonth, dateStr };
    });
    return { cells, daysInMonth: dim };
  }, [year, month]);

  // Posts for the visible month (for stats)
  const monthPosts = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
    return filteredPosts.filter((p) => p.date.startsWith(prefix));
  }, [filteredPosts, year, month]);

  // Selected day posts
  const selectedPosts = useMemo(
    () => (selectedDate ? (postsByDate.get(selectedDate) ?? []) : []),
    [postsByDate, selectedDate]
  );

  // Navigation
  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDate(null);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDate(null);
  }
  function goToday() {
    setYear(TODAY_YEAR);
    setMonth(TODAY_MONTH);
    setSelectedDate(TODAY);
  }

  // Platform filter handlers
  function togglePlatform(p: CalPlatform) {
    setActivePlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) { next.delete(p); } else { next.add(p); }
      return next.size === 0 ? prev : next; // keep at least one
    });
  }
  function allPlatforms() {
    setActivePlatforms(new Set(ALL_PLATFORMS));
  }

  const weeks = Math.ceil(cells.length / 7);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div
        className="flex items-start justify-between px-8 py-5 border-b gap-4 flex-wrap shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          >
            <CalendarDays size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
              Content Calendar
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Plan and schedule your content across all platforms
            </p>
          </div>
        </div>
        <MonthStats posts={monthPosts} />
      </div>

      {/* ── Filter + nav bar ──────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-8 py-3 border-b shrink-0 gap-4 flex-wrap"
        style={{ borderColor: "var(--border)" }}
      >
        <PlatformFilterBar
          active={activePlatforms}
          onToggle={togglePlatform}
          onAll={allPlatforms}
        />

        {/* Month nav */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold w-36 text-center" style={{ color: "var(--foreground)" }}>
            {formatMonthYear(year, month)}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={goToday}
            className="px-3 py-1.5 rounded-lg text-xs font-medium ml-2 transition-colors hover:bg-white/5 border"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            Today
          </button>
        </div>
      </div>

      {/* ── Calendar body ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          {/* Calendar grid */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            {/* Day-of-week headers */}
            <div
              className="grid grid-cols-7 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              {DOW_LABELS.map((d, i) => (
                <div
                  key={d}
                  className="py-2.5 text-center text-xs font-medium border-r last:border-r-0"
                  style={{
                    color:
                      i === 0 || i === 6
                        ? "var(--muted-foreground)"
                        : "var(--muted-foreground)",
                    borderColor: "var(--border)",
                    opacity: i === 0 || i === 6 ? 0.55 : 1,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Rows */}
            {Array.from({ length: weeks }, (_, wk) => (
              <div
                key={wk}
                className="grid grid-cols-7 border-b last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                {cells.slice(wk * 7, wk * 7 + 7).map((cell, ci) => {
                  const isToday = cell.dateStr === TODAY;
                  const isSelected = cell.dateStr === selectedDate;
                  const dayPosts = cell.dateStr ? (postsByDate.get(cell.dateStr) ?? []) : [];
                  return (
                    <DayCell
                      key={ci}
                      day={cell.dayNum}
                      dateStr={cell.dateStr}
                      isCurrentMonth={cell.isCurrentMonth}
                      isToday={isToday}
                      isSelected={isSelected}
                      posts={dayPosts}
                      onClick={() => {
                        if (!cell.isCurrentMonth) return;
                        setSelectedDate((prev) =>
                          prev === cell.dateStr ? null : cell.dateStr
                        );
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* ── Detail panel ────────────────────────────────────────────────── */}
          {selectedDate && selectedPosts.length > 0 && (
            <DetailPanel
              dateStr={selectedDate}
              posts={selectedPosts}
              onClose={() => setSelectedDate(null)}
            />
          )}

          {/* Empty selected day */}
          {selectedDate && selectedPosts.length === 0 && (
            <div
              className="rounded-xl border mt-4 px-6 py-8 flex flex-col items-center gap-3"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <CalendarDays size={28} style={{ color: "var(--muted-foreground)", opacity: 0.5 }} />
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  No posts on {formatDisplayDate(selectedDate)}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Nothing scheduled or published for the active platform filters on this day.
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "var(--muted-foreground)" }}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ── Platform legend ────────────────────────────────────────────── */}
          <div className="flex items-center gap-6 mt-5 flex-wrap">
            {ALL_PLATFORMS.map((p) => {
              const conf = CAL_PLATFORM_CONFIG[p];
              const isActive = activePlatforms.has(p);
              return (
                <div
                  key={p}
                  className="flex items-center gap-1.5"
                  style={{ opacity: isActive ? 1 : 0.35 }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: conf.color }}
                  />
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {conf.label}
                  </span>
                </div>
              );
            })}
            <div className="flex items-center gap-1.5 ml-auto">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: "#10b981" }}
              />
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Today
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
