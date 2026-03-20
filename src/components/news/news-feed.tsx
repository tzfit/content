"use client";

import { useMemo, useState } from "react";
import {
  Newspaper,
  Rss,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  RefreshCw,
  Clock,
  ChevronRight,
  X,
  Filter,
  FlaskConical,
  Wrench,
  TrendingUp,
  Dumbbell,
  Flame,
  Zap,
  Leaf,
} from "lucide-react";
import {
  NEWS_ARTICLES,
  RSS_FEEDS,
  TOPIC_CONFIG,
  CONTENT_TYPE_CONFIG,
  ALL_TOPICS,
  ALL_CONTENT_TYPES,
  NewsArticle,
  NewsTopic,
  ContentType,
  formatRelativeDate,
  formatFullDate,
} from "@/lib/news-data";
import { cn } from "@/lib/utils";

// ── Constants ──────────────────────────────────────────────────────────────────

const TOPIC_ICONS: Record<NewsTopic, React.ElementType> = {
  fitness:     Dumbbell,
  "fat-loss":  Flame,
  hypertrophy: Zap,
  nutrition:   Leaf,
};

const CONTENT_ICONS: Record<ContentType, React.ElementType> = {
  research: FlaskConical,
  tools:    Wrench,
  business: TrendingUp,
};

type SortOrder = "newest" | "oldest";

// ── Article card ───────────────────────────────────────────────────────────────

function ArticleCard({
  article,
  isBookmarked,
  isRead,
  onBookmark,
  onRead,
}: {
  article: NewsArticle;
  isBookmarked: boolean;
  isRead: boolean;
  onBookmark: () => void;
  onRead: () => void;
}) {
  const topic = TOPIC_CONFIG[article.topic];
  const ctype = CONTENT_TYPE_CONFIG[article.contentType];
  const ContentIcon = CONTENT_ICONS[article.contentType];

  return (
    <article
      className="rounded-xl border flex flex-col overflow-hidden transition-all duration-150 hover:-translate-y-px group"
      style={{
        backgroundColor: "var(--card)",
        borderColor: isRead ? "var(--border)" : "var(--border)",
        opacity: isRead ? 0.72 : 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        borderTop: `3px solid ${topic.color}`,
      }}
    >
      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Content type */}
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ backgroundColor: ctype.color + "20", color: ctype.color }}
          >
            <ContentIcon size={9} />
            {ctype.label}
          </span>
          {/* Topic */}
          <span
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: topic.color + "15", color: topic.color }}
          >
            {topic.label}
          </span>
          {/* Read indicator */}
          {isRead && (
            <span className="text-[10px] ml-auto" style={{ color: "var(--muted-foreground)" }}>
              Read
            </span>
          )}
        </div>

        {/* Headline */}
        <h3
          className="font-semibold text-sm leading-snug"
          style={{
            color: "var(--foreground)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.headline}
        </h3>

        {/* Summary */}
        <p
          className="text-xs leading-relaxed flex-1"
          style={{
            color: "var(--muted-foreground)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Source + date */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
            {article.source}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {formatRelativeDate(article.publishedAt)}
            </span>
            <span style={{ color: "var(--border)" }}>·</span>
            <Clock size={9} style={{ color: "var(--muted-foreground)" }} />
            <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {article.readMinutes} min
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onBookmark(); }}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-white/5"
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {isBookmarked
              ? <BookmarkCheck size={13} style={{ color: "#f59e0b" }} />
              : <Bookmark size={13} style={{ color: "var(--muted-foreground)" }} />}
          </button>
          <a
            href="#"
            onClick={e => { e.preventDefault(); onRead(); }}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-white/5"
            title="Open article"
          >
            <ExternalLink size={13} style={{ color: "var(--muted-foreground)" }} />
          </a>
        </div>
      </div>
    </article>
  );
}

// ── Source pill in sidebar ─────────────────────────────────────────────────────

function FeedItem({
  feed,
  active,
  onToggle,
}: {
  feed: typeof RSS_FEEDS[number];
  active: boolean;
  onToggle: () => void;
}) {
  const topic = TOPIC_CONFIG[feed.topic];
  const ctype = CONTENT_TYPE_CONFIG[feed.contentType];
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all"
      style={{
        backgroundColor: active ? "var(--secondary)" : "transparent",
        borderColor: active ? "var(--border)" : "transparent",
        opacity: active ? 1 : 0.5,
      }}
    >
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: topic.color + "25" }}
      >
        <Rss size={10} style={{ color: topic.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
          {feed.name}
        </p>
        <p className="text-[10px] mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
          {feed.articleCount} articles · {ctype.label}
        </p>
      </div>
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function NewsFeed() {
  const [activeTopic, setActiveTopic] = useState<NewsTopic | "all">("all");
  const [activeType, setActiveType] = useState<ContentType | "all">("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());
  const [activeFeeds, setActiveFeeds] = useState<Set<string>>(
    new Set(RSS_FEEDS.map(f => f.id))
  );
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Mar 20, 2026 · 9:00 AM");

  function toggleBookmark(id: string) {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function markRead(id: string) {
    setReadArticles(prev => new Set(prev).add(id));
  }

  function toggleFeed(id: string) {
    setActiveFeeds(prev => {
      if (prev.size === 1 && prev.has(id)) return prev;
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function simulateRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed("Mar 20, 2026 · 9:42 AM");
    }, 1200);
  }

  // Per-topic article counts (for sidebar badges)
  const topicCounts = useMemo(() => {
    const m: Record<string, number> = { all: NEWS_ARTICLES.length };
    for (const a of NEWS_ARTICLES) {
      m[a.topic] = (m[a.topic] ?? 0) + 1;
    }
    return m;
  }, []);

  // Per-type article counts
  const typeCounts = useMemo(() => {
    const src = activeTopic === "all" ? NEWS_ARTICLES : NEWS_ARTICLES.filter(a => a.topic === activeTopic);
    const m: Record<string, number> = { all: src.length };
    for (const a of src) m[a.contentType] = (m[a.contentType] ?? 0) + 1;
    return m;
  }, [activeTopic]);

  // Filtered + sorted articles
  const filtered = useMemo(() => {
    let list = NEWS_ARTICLES;

    // Source feed filter
    const activeFeedSources = new Set(RSS_FEEDS.filter(f => activeFeeds.has(f.id)).map(f => f.id));
    list = list.filter(a => activeFeedSources.has(a.sourceId));

    if (activeTopic !== "all") list = list.filter(a => a.topic === activeTopic);
    if (activeType !== "all") list = list.filter(a => a.contentType === activeType);
    if (showBookmarksOnly) list = list.filter(a => bookmarks.has(a.id));

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.headline.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => {
      const ta = new Date(a.publishedAt).getTime();
      const tb = new Date(b.publishedAt).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
  }, [activeTopic, activeType, search, sortOrder, showBookmarksOnly, bookmarks, activeFeeds]);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-8 py-5 border-b shrink-0 gap-4 flex-wrap"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
          >
            <Newspaper size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
              News Feed
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {RSS_FEEDS.length} RSS sources · Updated {lastRefreshed}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {bookmarks.size > 0 && (
            <button
              onClick={() => setShowBookmarksOnly(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={{
                backgroundColor: showBookmarksOnly ? "#f59e0b20" : "transparent",
                borderColor: showBookmarksOnly ? "#f59e0b60" : "var(--border)",
                color: showBookmarksOnly ? "#f59e0b" : "var(--muted-foreground)",
              }}
            >
              <BookmarkCheck size={13} />
              Bookmarks ({bookmarks.size})
            </button>
          )}
          <button
            onClick={simulateRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:bg-white/5"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing…" : "Refresh feeds"}
          </button>
        </div>
      </div>

      {/* ── Body: sidebar + main ───────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
        <aside
          className="w-56 shrink-0 border-r flex flex-col overflow-y-auto"
          style={{ borderColor: "var(--border)", backgroundColor: "#0d1117" }}
        >
          {/* Topics */}
          <div className="px-4 pt-5 pb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted-foreground)" }}>
              Topic
            </p>
            <div className="space-y-0.5">
              {/* All */}
              {(() => {
                const isActive = activeTopic === "all";
                return (
                  <button
                    onClick={() => setActiveTopic("all")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors"
                    style={{
                      backgroundColor: isActive ? "var(--secondary)" : "transparent",
                      color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Newspaper size={13} />
                      All Topics
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
                    >
                      {topicCounts.all}
                    </span>
                  </button>
                );
              })()}

              {ALL_TOPICS.map(topic => {
                const conf = TOPIC_CONFIG[topic];
                const Icon = TOPIC_ICONS[topic];
                const isActive = activeTopic === topic;
                return (
                  <button
                    key={topic}
                    onClick={() => setActiveTopic(topic)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors"
                    style={{
                      backgroundColor: isActive ? conf.color + "18" : "transparent",
                      color: isActive ? conf.color : "var(--muted-foreground)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={13} />
                      {conf.label}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: isActive ? conf.color + "25" : "var(--muted)",
                        color: isActive ? conf.color : "var(--muted-foreground)",
                      }}
                    >
                      {topicCounts[topic] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mx-4 my-2 border-t" style={{ borderColor: "var(--border)" }} />

          {/* RSS Sources */}
          <div className="px-4 pb-5 flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                RSS Sources
              </p>
              <button
                className="text-[10px] transition-colors hover:opacity-80"
                style={{ color: "#3b82f6" }}
                onClick={() => setActiveFeeds(new Set(RSS_FEEDS.map(f => f.id)))}
              >
                All on
              </button>
            </div>
            <div className="space-y-1">
              {RSS_FEEDS.map(feed => (
                <FeedItem
                  key={feed.id}
                  feed={feed}
                  active={activeFeeds.has(feed.id)}
                  onToggle={() => toggleFeed(feed.id)}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN FEED ───────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div
            className="flex items-center gap-3 px-6 py-3 border-b shrink-0 flex-wrap"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Content type tabs */}
            <div className="flex items-center gap-0.5 p-1 rounded-lg" style={{ backgroundColor: "var(--secondary)" }}>
              <button
                onClick={() => setActiveType("all")}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  backgroundColor: activeType === "all" ? "var(--card)" : "transparent",
                  color: activeType === "all" ? "var(--foreground)" : "var(--muted-foreground)",
                }}
              >
                All
                <span className="ml-1.5 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  {typeCounts.all ?? 0}
                </span>
              </button>
              {ALL_CONTENT_TYPES.map(ct => {
                const conf = CONTENT_TYPE_CONFIG[ct];
                const Icon = CONTENT_ICONS[ct];
                const isActive = activeType === ct;
                return (
                  <button
                    key={ct}
                    onClick={() => setActiveType(ct)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: isActive ? conf.color + "20" : "transparent",
                      color: isActive ? conf.color : "var(--muted-foreground)",
                    }}
                  >
                    <Icon size={11} />
                    {conf.label}
                    <span className="text-[10px]" style={{ color: isActive ? conf.color : "var(--muted-foreground)", opacity: 0.7 }}>
                      {typeCounts[ct] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 max-w-xs"
              style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}
            >
              <Search size={12} style={{ color: "var(--muted-foreground)" }} />
              <input
                type="text"
                placeholder="Search headlines, sources, tags…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-xs outline-none flex-1"
                style={{ color: "var(--foreground)" }}
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={11} style={{ color: "var(--muted-foreground)" }} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Sort:</span>
              <div className="flex items-center gap-0.5 p-0.5 rounded-md" style={{ backgroundColor: "var(--secondary)" }}>
                {(["newest", "oldest"] as SortOrder[]).map(o => (
                  <button
                    key={o}
                    onClick={() => setSortOrder(o)}
                    className="px-2.5 py-1 rounded text-xs font-medium transition-colors capitalize"
                    style={{
                      backgroundColor: sortOrder === o ? "var(--card)" : "transparent",
                      color: sortOrder === o ? "var(--foreground)" : "var(--muted-foreground)",
                    }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count */}
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Article grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #3b82f620, #6366f120)" }}
                >
                  <Newspaper size={28} style={{ color: "#3b82f6" }} />
                </div>
                <div className="text-center">
                  <p className="font-semibold" style={{ color: "var(--foreground)" }}>
                    No articles match your filters
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                    Try adjusting your topic, content type, or search query.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTopic("all");
                    setActiveType("all");
                    setSearch("");
                    setShowBookmarksOnly(false);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-white/5"
                  style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {filtered.map(article => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      isBookmarked={bookmarks.has(article.id)}
                      isRead={readArticles.has(article.id)}
                      onBookmark={() => toggleBookmark(article.id)}
                      onRead={() => markRead(article.id)}
                    />
                  ))}
                </div>

                {/* Feed attribution footer */}
                <div
                  className="mt-8 pt-6 border-t flex items-start gap-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Rss size={14} style={{ color: "var(--muted-foreground)", marginTop: 1 }} />
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    Content aggregated from {RSS_FEEDS.filter(f => activeFeeds.has(f.id)).length} active RSS feeds.
                    All articles link to original sources. Summaries are generated from full-text RSS content.
                    Last refreshed: {lastRefreshed}.
                  </p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
