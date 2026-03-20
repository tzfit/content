// ── Types ──────────────────────────────────────────────────────────────────────

export type Platform = "instagram" | "tiktok" | "twitter";

export interface DailyMetric {
  date: string; // YYYY-MM-DD
  impressions: number;
  reach: number;
  engagementRate: number; // 0–100
  followers: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface PlatformSummary {
  platform: Platform;
  totalFollowers: number;
  followerGrowth: number;
  followerGrowthPct: number;
  totalImpressions: number;
  impressionsDelta: number;
  avgEngagementRate: number;
  engagementDelta: number;
  totalReach: number;
  reachDelta: number;
}

export interface TopPost {
  id: string;
  platform: Platform;
  caption: string;
  postType: "photo" | "video" | "reel" | "carousel" | "story";
  date: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

export interface MetricoolData {
  timeSeries: Record<Platform, DailyMetric[]>;
  summaries: Record<Platform, PlatformSummary>;
  topPosts: TopPost[];
}

export const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; color: string; gradientFrom: string; gradientTo: string }
> = {
  instagram: {
    label: "Instagram",
    color: "#e1306c",
    gradientFrom: "#e1306c",
    gradientTo: "#f77737",
  },
  tiktok: {
    label: "TikTok",
    color: "#69c9d0",
    gradientFrom: "#69c9d0",
    gradientTo: "#ee1d52",
  },
  twitter: {
    label: "Twitter / X",
    color: "#1d9bf0",
    gradientFrom: "#1d9bf0",
    gradientTo: "#0a85d9",
  },
};

// ── Seeded pseudo-random (LCG) ─────────────────────────────────────────────────

function makePRNG(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Data generation ────────────────────────────────────────────────────────────

const TODAY = new Date("2026-03-20");

function dateStr(offset: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

function generateTimeSeries(
  seed: number,
  opts: {
    baseImpressions: number;
    followerStart: number;
    followerDailyGrowth: number;
    baseEngagement: number;
    engagementVariance: number;
    impressionVariance: number;
    reachRatio: number;
  }
): DailyMetric[] {
  const rand = makePRNG(seed);
  const days: DailyMetric[] = [];

  for (let i = 89; i >= 0; i--) {
    const dayFraction = (89 - i) / 89; // 0→1 trend
    const weekdayBoost = (() => {
      const d = new Date(TODAY);
      d.setDate(d.getDate() - i);
      const day = d.getDay(); // 0=Sun, 6=Sat
      return day >= 1 && day <= 5 ? 1.0 : 0.75; // weekday higher
    })();

    const noise = 0.7 + rand() * 0.6;
    const trendMultiplier = 1 + dayFraction * 0.35;
    const impressions = Math.round(
      opts.baseImpressions * noise * trendMultiplier * weekdayBoost
    );

    const engNoise = 1 - opts.engagementVariance / 2 + rand() * opts.engagementVariance;
    const engRate = Math.round(opts.baseEngagement * engNoise * 100) / 100;

    const followers = Math.round(
      opts.followerStart + dayFraction * opts.followerDailyGrowth * 89
    );

    const reach = Math.round(impressions * opts.reachRatio);
    const totalEngaged = Math.round(reach * (engRate / 100));
    const likes = Math.round(totalEngaged * (0.6 + rand() * 0.15));
    const comments = Math.round(totalEngaged * (0.1 + rand() * 0.05));
    const shares = totalEngaged - likes - comments;

    days.push({
      date: dateStr(i),
      impressions,
      reach,
      engagementRate: engRate,
      followers,
      likes,
      comments,
      shares: Math.max(0, shares),
    });
  }

  return days;
}

function summarize(
  series: DailyMetric[],
  platform: Platform,
  fromIdx: number,
  prevLen: number
): PlatformSummary {
  const current = series.slice(fromIdx);
  const previous = series.slice(Math.max(0, fromIdx - prevLen), fromIdx);

  const sum = (arr: DailyMetric[], key: keyof DailyMetric) =>
    arr.reduce((acc, d) => acc + (d[key] as number), 0);
  const avg = (arr: DailyMetric[], key: keyof DailyMetric) =>
    arr.length ? sum(arr, key) / arr.length : 0;

  const totalImpressions = sum(current, "impressions");
  const prevImpressions = sum(previous, "impressions");
  const impressionsDelta = prevImpressions
    ? Math.round(((totalImpressions - prevImpressions) / prevImpressions) * 100)
    : 0;

  const totalReach = sum(current, "reach");
  const prevReach = sum(previous, "reach");
  const reachDelta = prevReach
    ? Math.round(((totalReach - prevReach) / prevReach) * 100)
    : 0;

  const avgEngagementRate = Math.round(avg(current, "engagementRate") * 10) / 10;
  const prevEngRate = Math.round(avg(previous, "engagementRate") * 10) / 10;
  const engagementDelta = Math.round((avgEngagementRate - prevEngRate) * 10) / 10;

  const lastFollowers = current[current.length - 1]?.followers ?? 0;
  const firstFollowers = current[0]?.followers ?? lastFollowers;
  const followerGrowth = lastFollowers - firstFollowers;
  const followerGrowthPct =
    firstFollowers > 0
      ? Math.round((followerGrowth / firstFollowers) * 1000) / 10
      : 0;

  return {
    platform,
    totalFollowers: lastFollowers,
    followerGrowth,
    followerGrowthPct,
    totalImpressions,
    impressionsDelta,
    avgEngagementRate,
    engagementDelta,
    totalReach,
    reachDelta,
  };
}

// ── All 90 days generated once ─────────────────────────────────────────────────

const IG_SERIES = generateTimeSeries(42, {
  baseImpressions: 52000,
  followerStart: 42000,
  followerDailyGrowth: 59,
  baseEngagement: 4.4,
  engagementVariance: 0.4,
  impressionVariance: 0.3,
  reachRatio: 0.72,
});

const TT_SERIES = generateTimeSeries(137, {
  baseImpressions: 130000,
  followerStart: 18500,
  followerDailyGrowth: 115,
  baseEngagement: 8.7,
  engagementVariance: 0.6,
  impressionVariance: 0.55,
  reachRatio: 0.85,
});

const TW_SERIES = generateTimeSeries(99, {
  baseImpressions: 16000,
  followerStart: 12200,
  followerDailyGrowth: 18,
  baseEngagement: 2.6,
  engagementVariance: 0.35,
  impressionVariance: 0.28,
  reachRatio: 0.6,
});

const TOP_POSTS: TopPost[] = [
  {
    id: "tp1",
    platform: "instagram",
    caption: "Spring collection reveal — every piece crafted with intention. Tap to shop the full drop.",
    postType: "carousel",
    date: "2026-03-15",
    impressions: 124800,
    reach: 98400,
    likes: 4312,
    comments: 387,
    shares: 821,
    engagementRate: 5.6,
  },
  {
    id: "tp2",
    platform: "tiktok",
    caption: "POV: you finally found a brand that actually walks the talk #sustainability #fashion",
    postType: "video",
    date: "2026-03-12",
    impressions: 892000,
    reach: 741000,
    likes: 67400,
    comments: 2100,
    shares: 14800,
    engagementRate: 11.4,
  },
  {
    id: "tp3",
    platform: "instagram",
    caption: "Behind the lens — our creative director shares the mood board that started it all.",
    postType: "reel",
    date: "2026-03-08",
    impressions: 87300,
    reach: 64200,
    likes: 3890,
    comments: 244,
    shares: 512,
    engagementRate: 7.2,
  },
  {
    id: "tp4",
    platform: "twitter",
    caption: "We asked our community what they want from us in 2026. Here's what you said (thread) 🧵",
    postType: "photo",
    date: "2026-03-10",
    impressions: 48200,
    reach: 31700,
    likes: 1240,
    comments: 318,
    shares: 642,
    engagementRate: 4.5,
  },
  {
    id: "tp5",
    platform: "tiktok",
    caption: "Outfit check: styling our Solstice jacket 5 different ways #GRWM #ootd",
    postType: "video",
    date: "2026-03-18",
    impressions: 650000,
    reach: 540000,
    likes: 48200,
    comments: 1870,
    shares: 9400,
    engagementRate: 9.8,
  },
  {
    id: "tp6",
    platform: "instagram",
    caption: "Customer of the month — meet @rosa.creates and her incredible story.",
    postType: "photo",
    date: "2026-03-05",
    impressions: 61400,
    reach: 44700,
    likes: 2670,
    comments: 193,
    shares: 287,
    engagementRate: 6.9,
  },
];

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Slice the time-series and compute summaries for a given date window.
 * `days` = number of days back from today (e.g. 7, 14, 30, 90).
 */
export function getMetricoolData(days: number): MetricoolData {
  const fromIdx = Math.max(0, 90 - days);
  const prevLen = days;

  const igSlice = IG_SERIES.slice(fromIdx);
  const ttSlice = TT_SERIES.slice(fromIdx);
  const twSlice = TW_SERIES.slice(fromIdx);

  return {
    timeSeries: {
      instagram: igSlice,
      tiktok: ttSlice,
      twitter: twSlice,
    },
    summaries: {
      instagram: summarize(IG_SERIES, "instagram", fromIdx, prevLen),
      tiktok: summarize(TT_SERIES, "tiktok", fromIdx, prevLen),
      twitter: summarize(TW_SERIES, "twitter", fromIdx, prevLen),
    },
    topPosts: TOP_POSTS,
  };
}

/**
 * Merge all platforms' time-series into one combined series (by date).
 */
export type MergedRow = { date: string } & Record<string, number | string>;

export function mergeTimeSeries(
  ts: Record<Platform, DailyMetric[]>
): MergedRow[] {
  const map = new Map<string, Record<string, number>>();

  (Object.keys(ts) as Platform[]).forEach((p) => {
    ts[p].forEach((d) => {
      const entry = map.get(d.date) ?? {};
      entry[`${p}_impressions`] = d.impressions;
      entry[`${p}_reach`] = d.reach;
      entry[`${p}_engagement`] = d.engagementRate;
      entry[`${p}_followers`] = d.followers;
      map.set(d.date, entry);
    });
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({ date, ...vals } as MergedRow));
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatLongDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
