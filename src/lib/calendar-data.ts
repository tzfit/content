// ── Types ──────────────────────────────────────────────────────────────────────

export type CalPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "linkedin";

export type PostStatus = "published" | "scheduled" | "draft";

export type PostType =
  | "photo"
  | "video"
  | "reel"
  | "carousel"
  | "story"
  | "short"
  | "article"
  | "thread";

export interface CalendarPost {
  id: string;
  platform: CalPlatform;
  title: string; // short chip label
  caption: string; // full caption shown in detail panel
  postType: PostType;
  status: PostStatus;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
}

// ── Platform config ────────────────────────────────────────────────────────────

export const CAL_PLATFORM_CONFIG: Record<
  CalPlatform,
  { label: string; abbr: string; color: string }
> = {
  instagram: { label: "Instagram", abbr: "IG", color: "#e1306c" },
  youtube: { label: "YouTube", abbr: "YT", color: "#ff4040" },
  tiktok: { label: "TikTok", abbr: "TT", color: "#42d4c0" },
  twitter: { label: "Twitter / X", abbr: "X", color: "#1d9bf0" },
  linkedin: { label: "LinkedIn", abbr: "LI", color: "#0a84d1" },
};

export const POST_TYPE_LABELS: Record<PostType, string> = {
  photo: "Photo",
  video: "Video",
  reel: "Reel",
  carousel: "Carousel",
  story: "Story",
  short: "Short",
  article: "Article",
  thread: "Thread",
};

// ── Seed data ──────────────────────────────────────────────────────────────────
// Spans Feb – Apr 2026. Today = March 20 2026.
// Posts dated ≤ today are "published"; later are "scheduled".

function p(
  id: string,
  platform: CalPlatform,
  date: string,
  time: string,
  postType: PostType,
  title: string,
  caption: string
): CalendarPost {
  const today = "2026-03-20";
  const status: PostStatus = date <= today ? "published" : "scheduled";
  return { id, platform, date, time, postType, title, caption, status };
}

export const CALENDAR_POSTS: CalendarPost[] = [
  // ── February 2026 ──────────────────────────────────────────────────────────
  p("f1", "instagram", "2026-02-03", "09:00", "photo",
    "Winter edit drop",
    "The winter edit is here — each piece designed for the coldest mornings and the longest nights. Shop via link in bio."),
  p("f2", "youtube", "2026-02-05", "14:00", "video",
    "Brand story ep. 1",
    "Our brand story, from a kitchen table to 50k customers. Episode 1 is live on YouTube now."),
  p("f3", "tiktok", "2026-02-07", "18:00", "reel",
    "5 winter styling tips",
    "5 ways to style our Solstice Jacket this winter — each one fire 🔥 #ootd #styling"),
  p("f4", "twitter", "2026-02-10", "11:00", "thread",
    "Building in public",
    "We've been building in public for 6 months. Here's everything we've learned (thread) 🧵"),
  p("f5", "linkedin", "2026-02-11", "08:30", "article",
    "Sustainable supply chain",
    "How we reduced our supply chain emissions by 34% without raising prices. Full breakdown:"),
  p("f6", "instagram", "2026-02-13", "10:00", "carousel",
    "Valentine's gift guide",
    "Not your average Valentine's Day gift guide. Swipe for 8 ideas from our community →"),
  p("f7", "tiktok", "2026-02-14", "17:00", "short",
    "Valentine's GRWM",
    "Valentine's Day GRWM using only our new Glow Edit collection 💄 #valentinesday #GRWM"),
  p("f8", "youtube", "2026-02-17", "14:00", "video",
    "Workshop highlights",
    "Behind the scenes from our live workshop last weekend. Watch the full replay now."),
  p("f9", "instagram", "2026-02-18", "09:30", "reel",
    "Behind the seams",
    "Ever wonder what goes into making one of our jackets? We went behind the seams. 🧵"),
  p("f10", "twitter", "2026-02-19", "12:00", "thread",
    "Q1 roadmap preview",
    "Our Q1 roadmap is almost set. Here's a sneak peek at what we're shipping in the next 90 days."),
  p("f11", "instagram", "2026-02-21", "10:00", "story",
    "Poll: Next drop?",
    "Help us decide what drops next — vote in today's story!"),
  p("f12", "linkedin", "2026-02-24", "09:00", "article",
    "2025 impact report",
    "Our 2025 Impact Report is out. 40% recycled materials, carbon-neutral shipping, and more."),
  p("f13", "tiktok", "2026-02-25", "19:00", "reel",
    "Packaging reveal",
    "We redesigned every single piece of our packaging. Here's why. #sustainable #packaging"),
  p("f14", "instagram", "2026-02-27", "11:00", "carousel",
    "Community spotlight",
    "Meet 5 members of our community who are doing incredible things. Swipe to be inspired →"),

  // ── March 2026 ─────────────────────────────────────────────────────────────
  p("m1", "youtube", "2026-03-03", "14:00", "video",
    "Spring lookbook",
    "Spring Lookbook 2026 — 12 looks, all styled by our community. Drop in the comments which was your favourite."),
  p("m2", "instagram", "2026-03-04", "09:00", "photo",
    "New palette launch",
    "Six new colourways. One season. Introducing the Spring 2026 palette — available now."),
  p("m3", "tiktok", "2026-03-05", "18:00", "reel",
    "Try-on haul",
    "Try-on haul: every piece from the spring drop rated honest & unfiltered 🌿 #tryonhaul"),
  p("m4", "twitter", "2026-03-06", "11:30", "thread",
    "Pricing transparency",
    "Why does our Linen Shirt cost $148? A full cost breakdown from fabric to your door. (thread)"),
  p("m5", "instagram", "2026-03-10", "10:00", "reel",
    "Sunrise campaign BTS",
    "We shot our latest campaign at 4am. Chaos, magic, and some very good coffee ☀️"),
  p("m6", "linkedin", "2026-03-11", "08:00", "article",
    "Why we went DTC",
    "Three years ago we cut all our wholesale accounts. Here's what happened next."),
  p("m7", "youtube", "2026-03-12", "15:00", "video",
    "Founder Q&A",
    "Founder Q&A — we answered every question from our community. Nothing off limits."),
  p("m8", "instagram", "2026-03-13", "09:00", "carousel",
    "Styling: 3 ways",
    "One piece. Three outfits. All under 2 minutes. Swipe through the full breakdown →"),
  p("m9", "tiktok", "2026-03-14", "19:00", "short",
    "Hype vs reality",
    "Hype vs Reality: our most viral piece, reviewed honestly 👀 #fashion #review"),
  p("m10", "twitter", "2026-03-16", "10:00", "thread",
    "Customer story thread",
    "We asked 10 customers to share their story. Reading their responses made us proud. (thread) 🧵"),
  p("m11", "instagram", "2026-03-17", "09:30", "photo",
    "St. Patrick's Day",
    "Wearing green? We'll allow it. 🍀 Happy St. Patrick's Day from the team."),
  p("m12", "tiktok", "2026-03-18", "17:00", "reel",
    "Spring capsule pack",
    "Building the perfect spring capsule wardrobe with 8 pieces 🌸 #capsulewardrobe"),
  p("m13", "youtube", "2026-03-18", "14:00", "video",
    "Textile sourcing doc",
    "We visited every one of our suppliers to document how our fabrics are made. Watch now."),
  p("m14", "instagram", "2026-03-19", "09:00", "story",
    "Flash sale 24h",
    "24 hour flash sale — 20% off everything. Link in bio before it ends tonight."),
  p("m15", "linkedin", "2026-03-19", "08:30", "article",
    "Design process deep dive",
    "How we go from concept to collection in 12 weeks — our full design process, unfiltered."),
  // Today (March 20) — scheduled + published
  p("m16", "instagram", "2026-03-20", "10:00", "carousel",
    "Spring reveal ↓",
    "The spring collection is fully live. Every single piece we've been hinting at — swipe through →"),
  p("m17", "twitter", "2026-03-20", "12:00", "thread",
    "Spring launch day",
    "It's launch day. Here's everything that went into making Spring 2026 our most intentional collection yet. 🧵"),
  // Post-today (scheduled)
  p("m18", "tiktok", "2026-03-22", "18:00", "reel",
    "Packaging unboxing",
    "Unboxing our new compostable packaging for the first time — this is so satisfying 📦 #unboxing"),
  p("m19", "youtube", "2026-03-24", "15:00", "video",
    "Spring styling vol. 2",
    "Spring styling guide volume 2 — this time with transitional layering for unpredictable weather."),
  p("m20", "instagram", "2026-03-25", "09:00", "photo",
    "Community edit",
    "This week's community edit — wearing the spring collection your way. Tag us to be featured."),
  p("m21", "linkedin", "2026-03-25", "08:00", "article",
    "Scaling DTC to 7 figures",
    "What it actually takes to scale a DTC brand past 7 figures: the parts nobody talks about."),
  p("m22", "instagram", "2026-03-26", "10:00", "carousel",
    "Top 5 pieces",
    "Our 5 most-loved pieces from the new drop, as voted by you. Swipe for the full breakdown →"),
  p("m23", "tiktok", "2026-03-27", "19:00", "short",
    "Outfit check: Earth tones",
    "Outfit check: full earth tone palette using only the spring drop 🌿 #ootd #earthtones"),
  p("m24", "twitter", "2026-03-28", "11:00", "thread",
    "Manufacturing partners",
    "Shining a light on our three manufacturing partners in Portugal. This is their story. 🧵"),
  p("m25", "instagram", "2026-03-31", "09:30", "story",
    "March recap",
    "March was something else. A look back at our biggest month yet 🌱"),

  // ── April 2026 ─────────────────────────────────────────────────────────────
  p("a1", "youtube", "2026-04-01", "14:00", "video",
    "April Fool's? Nope",
    "Not a prank: our biggest drop of the year lands in April. Here's what's coming."),
  p("a2", "instagram", "2026-04-02", "09:00", "reel",
    "New arrivals week 1",
    "New arrivals, week one — everything that just dropped and what to pair it with 🌷"),
  p("a3", "tiktok", "2026-04-03", "18:00", "short",
    "Transition wardrobe",
    "Transitioning your wardrobe from winter to spring in 60 seconds ⏱️ #wardrobeswitch"),
  p("a4", "linkedin", "2026-04-04", "08:30", "article",
    "Q1 results + lessons",
    "Q1 wrapped. Revenue, returns, what we got wrong, and what we're changing in Q2."),
  p("a5", "twitter", "2026-04-06", "12:00", "thread",
    "Community feedback",
    "We read every piece of feedback from Q1. Here's the unfiltered summary + what we're doing about it. 🧵"),
  p("a6", "instagram", "2026-04-08", "10:00", "carousel",
    "Earth Week prep",
    "Earth Week is April 20–26. Here's how we're celebrating — and what you can do too. Swipe →"),
  p("a7", "youtube", "2026-04-09", "15:00", "video",
    "Supply chain visit",
    "We visited our main supplier in Porto. A week of conversations, factory floors, and lots of fabric swatches."),
  p("a8", "tiktok", "2026-04-10", "17:00", "reel",
    "Earth Week styling",
    "Styling our most sustainable pieces for Earth Week 🌍 #earthweek #sustainablefashion"),
  p("a9", "instagram", "2026-04-14", "09:00", "photo",
    "New colour reveal",
    "Introducing the colour we've been hinting at for months. Meet: Sage. Available April 20."),
  p("a10", "linkedin", "2026-04-15", "08:00", "article",
    "The cost of returns",
    "Returns cost us $420k last year. Here's how we cut that number in half without penalising customers."),
  p("a11", "twitter", "2026-04-16", "11:00", "thread",
    "Carbon neutral shipping",
    "How we made every single shipment carbon neutral — without charging customers extra. (thread)"),
  p("a12", "instagram", "2026-04-20", "09:00", "carousel",
    "Earth Day campaign",
    "It's Earth Day. Here's our commitment for the next 12 months, and how you can hold us to it. 🌍"),
  p("a13", "tiktok", "2026-04-21", "18:00", "short",
    "Sage colourway styling",
    "Styling every piece in Sage, our newest colourway 🌿 #newcolour #sage #styling"),
  p("a14", "youtube", "2026-04-23", "14:00", "video",
    "Earth Week recap",
    "Earth Week 2026 — what we did, what we learned, and what we're committing to next year."),
];

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Build a lookup map: date string → posts */
export function buildPostsByDate(
  posts: CalendarPost[]
): Map<string, CalendarPost[]> {
  const map = new Map<string, CalendarPost[]>();
  for (const post of posts) {
    const arr = map.get(post.date) ?? [];
    arr.push(post);
    map.set(post.date, arr);
  }
  return map;
}

export function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function format12hTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}
