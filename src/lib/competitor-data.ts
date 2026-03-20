// ── Types ──────────────────────────────────────────────────────────────────────

export type CompPlatform =
  | "instagram"
  | "tiktok"
  | "twitter"
  | "youtube"
  | "linkedin";

export type CompPostType =
  | "photo"
  | "video"
  | "reel"
  | "carousel"
  | "short"
  | "article"
  | "thread";

export interface CompRecentPost {
  id: string;
  date: string; // YYYY-MM-DD
  type: CompPostType;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  engagementRate: number;
}

export interface CompAccount {
  id: string;
  platform: CompPlatform;
  handle: string;
  url: string;
  followers: number;
  following: number;
  totalPosts: number;
  engagementRate: number; // %
  avgLikes: number;
  avgComments: number;
  postsPerWeek: number;
  followerGrowth30d: number; // net
  followerGrowthPct30d: number; // %
  sparkline: number[]; // 12-week follower counts
  recentPosts: CompRecentPost[];
  lastPosted: string; // YYYY-MM-DD
}

export interface Competitor {
  id: string;
  name: string;
  color: string;
  addedAt: string;
  accounts: CompAccount[];
}

// ── Platform config ────────────────────────────────────────────────────────────

export const COMP_PLATFORM_CONFIG: Record<
  CompPlatform,
  { label: string; abbr: string; color: string; urlPrefix: string }
> = {
  instagram: { label: "Instagram", abbr: "IG", color: "#e1306c", urlPrefix: "instagram.com/" },
  tiktok: { label: "TikTok", abbr: "TT", color: "#42d4c0", urlPrefix: "tiktok.com/@" },
  twitter: { label: "Twitter / X", abbr: "X", color: "#1d9bf0", urlPrefix: "x.com/" },
  youtube: { label: "YouTube", abbr: "YT", color: "#ff4040", urlPrefix: "youtube.com/@" },
  linkedin: { label: "LinkedIn", abbr: "LI", color: "#0a84d1", urlPrefix: "linkedin.com/company/" },
};

export const POST_TYPE_LABELS: Record<CompPostType, string> = {
  photo: "Photo",
  video: "Video",
  reel: "Reel",
  carousel: "Carousel",
  short: "Short",
  article: "Article",
  thread: "Thread",
};

// Colors assigned to competitors in order
export const COMPETITOR_COLORS = [
  "#6366f1", "#e1306c", "#f59e0b", "#10b981",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

// ── Seeded PRNG ────────────────────────────────────────────────────────────────

function makePRNG(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223 >>> 0;
    return s / 0x100000000;
  };
}

export function strSeed(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export function formatDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function daysAgo(n: number): string {
  const d = new Date("2026-03-20");
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// ── Mock post generator ────────────────────────────────────────────────────────

const CAPTIONS: Record<CompPlatform, string[]> = {
  instagram: [
    "New drop just landed — every piece designed for the long game. Link in bio.",
    "Behind the scenes from our latest shoot. The mood was everything. 🎬",
    "We asked our community to style their favourites. Here's what came back →",
    "Crafted to outlast the trend. Because some things just don't go out of style.",
    "From concept to collection — the full process, unfiltered. Swipe through →",
    "Limited run. Once it's gone, it's gone. Don't say we didn't warn you.",
    "Our most requested colourway is finally back. Tag who needs to see this.",
    "Quality over everything. Always has been, always will be.",
  ],
  tiktok: [
    "This transition took me 3 hours to perfect but it was so worth it 🔥 #ootd",
    "Rating every item from the new drop honest & unfiltered 👀 #review",
    "POV: you found a brand that actually cares about quality #fashion",
    "The styling hack that changed how I dress forever ✨ #stylingtips",
    "Day in the life: creative director edition 🎨 #behindthescenes",
    "I tried the viral capsule wardrobe thing and here's what happened #capsulewardrobe",
    "Outfit check: spring edition 🌸 #springfashion #ootd",
    "How to build a sustainable wardrobe on any budget 💚 #sustainable",
  ],
  twitter: [
    "Our spring collection just dropped. Here's the full thread on how we made it 🧵",
    "Hot take: most 'sustainable' brands are lying to you. Here's how to tell the difference.",
    "We just crossed 300k followers. Here's everything we learned building this brand 🧵",
    "Unpopular opinion: overproduction is the fashion industry's biggest problem. Thread 👇",
    "Just shipped to 50 countries for the first time. Here's what we got wrong (and right) 🧵",
    "Your questions from last week answered. Nothing off limits this time. Thread 👇",
  ],
  youtube: [
    "We Visited Every Single One Of Our Suppliers — Here's What We Found",
    "How We Built A 7-Figure Brand Without Paid Ads (Full Breakdown)",
    "Spring/Summer 2026 Lookbook — 15 Outfits, All Community-Styled",
    "The Truth About Fast Fashion (And What We're Doing About It)",
    "From $0 to $1M: Our First Year In Business, Unfiltered",
    "Our Design Process Exposed — From Sketch To Shipping In 12 Weeks",
  ],
  linkedin: [
    "We turned down a $2M acquisition offer last year. Here's why — and what happened next.",
    "Three things we wish we knew before launching a DTC brand. Full breakdown in the comments.",
    "Our Q1 results are in. Revenue up 34%. Returns down 18%. Here's the honest breakdown.",
    "We made every shipment carbon-neutral without raising prices. Here's exactly how.",
    "The supply chain insight that changed how we think about product development.",
  ],
};

function generateRecentPosts(
  platform: CompPlatform,
  baseEngagement: number,
  baseFollowers: number,
  seed: number
): CompRecentPost[] {
  const rand = makePRNG(seed);
  const types: Record<CompPlatform, CompPostType[]> = {
    instagram: ["photo", "reel", "carousel", "photo", "reel"],
    tiktok: ["short", "video", "short", "video", "short"],
    twitter: ["thread", "thread", "thread", "thread", "thread"],
    youtube: ["video", "video", "video", "video", "video"],
    linkedin: ["article", "article", "article", "article", "article"],
  };
  const caps = CAPTIONS[platform];

  return Array.from({ length: 5 }, (_, i) => {
    const noise = 0.5 + rand() * 1.0;
    const engaged = Math.round(baseFollowers * (baseEngagement / 100) * noise);
    const likes = Math.round(engaged * (0.55 + rand() * 0.2));
    const comments = Math.round(engaged * (0.08 + rand() * 0.06));
    const shares = engaged - likes - comments;
    const hasViews = platform === "tiktok" || platform === "youtube";
    return {
      id: `${seed}-post-${i}`,
      date: daysAgo(i * 3 + Math.round(rand() * 2)),
      type: types[platform][i],
      caption: caps[Math.floor(rand() * caps.length)],
      likes,
      comments,
      shares: Math.max(0, shares),
      views: hasViews ? Math.round(baseFollowers * (1.5 + rand() * 4) * noise) : undefined,
      engagementRate: Math.round(((likes + comments + shares) / baseFollowers) * 1000) / 10,
    };
  });
}

function generateSparkline(followerNow: number, growthPct30d: number, seed: number): number[] {
  const rand = makePRNG(seed + 999);
  const start = followerNow / (1 + (growthPct30d / 100) * (12 / 4.3));
  const weeklyGrowth = (followerNow - start) / 12;
  const pts: number[] = [];
  let v = start;
  for (let i = 0; i < 12; i++) {
    v += weeklyGrowth * (0.4 + rand() * 1.2);
    pts.push(Math.max(0, Math.round(v)));
  }
  return pts;
}

// ── Public generator ───────────────────────────────────────────────────────────

export function generateAccount(
  platform: CompPlatform,
  handle: string,
  followers: number,
  engagement: number,
  postsPerWeek: number,
  growthPct: number,
  seed: number
): CompAccount {
  const rand = makePRNG(seed);
  const growth30d = Math.round(followers * (growthPct / 100));
  const conf = COMP_PLATFORM_CONFIG[platform];

  return {
    id: `${handle}-${platform}`,
    platform,
    handle: handle.startsWith("@") ? handle : `@${handle}`,
    url: `https://${conf.urlPrefix}${handle.replace(/^@/, "")}`,
    followers,
    following: Math.round(followers * (0.003 + rand() * 0.008)),
    totalPosts: Math.round(postsPerWeek * 52 * (1 + rand() * 2)),
    engagementRate: engagement,
    avgLikes: Math.round(followers * (engagement / 100) * 0.7),
    avgComments: Math.round(followers * (engagement / 100) * 0.08),
    postsPerWeek,
    followerGrowth30d: growth30d,
    followerGrowthPct30d: growthPct,
    sparkline: generateSparkline(followers, growthPct, seed),
    recentPosts: generateRecentPosts(platform, engagement, followers, seed + 1),
    lastPosted: daysAgo(Math.round(rand() * 3)),
  };
}

/** Create a brand-new competitor from user input with generated mock data. */
export function createMockCompetitor(
  name: string,
  entries: Array<{ platform: CompPlatform; handle: string }>,
  colorIndex: number,
): Competitor {
  const seed = strSeed(name + entries.map(e => e.handle).join(""));
  const rand = makePRNG(seed);

  const PLATFORM_DEFAULTS: Record<CompPlatform, { followers: number; engagement: number; postsPerWeek: number; growth: number }> = {
    instagram: { followers: Math.round((30000 + rand() * 200000) / 100) * 100, engagement: 3 + rand() * 5, postsPerWeek: 3 + rand() * 8, growth: 0.5 + rand() * 5 },
    tiktok: { followers: Math.round((20000 + rand() * 300000) / 100) * 100, engagement: 6 + rand() * 10, postsPerWeek: 5 + rand() * 12, growth: 2 + rand() * 20 },
    twitter: { followers: Math.round((15000 + rand() * 150000) / 100) * 100, engagement: 1 + rand() * 3, postsPerWeek: 5 + rand() * 15, growth: 0.2 + rand() * 3 },
    youtube: { followers: Math.round((5000 + rand() * 100000) / 100) * 100, engagement: 1 + rand() * 3, postsPerWeek: 0.5 + rand() * 3, growth: 0.5 + rand() * 4 },
    linkedin: { followers: Math.round((5000 + rand() * 80000) / 100) * 100, engagement: 2 + rand() * 4, postsPerWeek: 2 + rand() * 5, growth: 1 + rand() * 6 },
  };

  const accounts = entries.map((entry, i) => {
    const d = PLATFORM_DEFAULTS[entry.platform];
    return generateAccount(
      entry.platform,
      entry.handle,
      Math.round(d.followers),
      Math.round(d.engagement * 10) / 10,
      Math.round(d.postsPerWeek * 10) / 10,
      Math.round(d.growth * 10) / 10,
      seed + i * 100
    );
  });

  return {
    id: `comp-${seed}`,
    name,
    color: COMPETITOR_COLORS[colorIndex % COMPETITOR_COLORS.length],
    addedAt: "2026-03-20",
    accounts,
  };
}

// ── Seed data ──────────────────────────────────────────────────────────────────

export const SEED_COMPETITORS: Competitor[] = [
  {
    id: "northwave",
    name: "NorthWave",
    color: COMPETITOR_COLORS[0],
    addedAt: "2026-01-15",
    accounts: [
      generateAccount("instagram", "@northwave_co", 184200, 4.8, 6.2, 1.8, 101),
      generateAccount("tiktok", "@northwave_co", 97400, 9.1, 8.5, 8.5, 102),
      generateAccount("youtube", "@NorthWaveCo", 43100, 2.3, 2.0, 2.1, 103),
    ],
  },
  {
    id: "driftco",
    name: "DriftCo",
    color: COMPETITOR_COLORS[1],
    addedAt: "2026-01-15",
    accounts: [
      generateAccount("instagram", "@driftco", 324800, 3.9, 4.8, 1.6, 201),
      generateAccount("tiktok", "@driftco", 218300, 8.2, 10.3, 12.3, 202),
      generateAccount("twitter", "@driftco", 91200, 2.1, 14.0, 0.8, 203),
    ],
  },
  {
    id: "terrain",
    name: "Terrain Supply",
    color: COMPETITOR_COLORS[2],
    addedAt: "2026-01-22",
    accounts: [
      generateAccount("instagram", "@terrainsupply", 74600, 5.6, 3.5, 2.4, 301),
      generateAccount("youtube", "@TerrainSupply", 29800, 1.8, 1.5, 3.2, 302),
      generateAccount("linkedin", "terrain-supply", 47200, 3.2, 3.0, 4.1, 303),
    ],
  },
  {
    id: "lumen",
    name: "Lumen Studio",
    color: COMPETITOR_COLORS[3],
    addedAt: "2026-02-03",
    accounts: [
      generateAccount("instagram", "@lumenstudio", 148300, 6.2, 5.0, 3.1, 401),
      generateAccount("tiktok", "@lumenstudio", 91600, 11.4, 7.0, 15.2, 402),
      generateAccount("twitter", "@lumenstudio", 54100, 2.8, 8.5, 1.2, 403),
    ],
  },
  {
    id: "grove",
    name: "Grove Essentials",
    color: COMPETITOR_COLORS[4],
    addedAt: "2026-02-10",
    accounts: [
      generateAccount("instagram", "@groveessentials", 96200, 4.4, 4.2, 2.8, 501),
      generateAccount("tiktok", "@groveessentials", 124800, 7.8, 6.5, 18.4, 502),
    ],
  },
];
