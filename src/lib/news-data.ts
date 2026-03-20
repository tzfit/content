// ── Types ──────────────────────────────────────────────────────────────────────

export type NewsTopic = "fitness" | "fat-loss" | "hypertrophy" | "nutrition";
export type ContentType = "research" | "tools" | "business";

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  sourceId: string;
  publishedAt: string; // ISO date
  topic: NewsTopic;
  contentType: ContentType;
  readMinutes: number;
  tags: string[];
}

export interface RssFeed {
  id: string;
  name: string;
  url: string;
  topic: NewsTopic;
  contentType: ContentType;
  description: string;
  articleCount: number;
}

// ── Config maps ────────────────────────────────────────────────────────────────

export const TOPIC_CONFIG: Record<
  NewsTopic,
  { label: string; color: string; description: string }
> = {
  fitness:     { label: "Fitness",     color: "#6366f1", description: "Training, performance & movement science" },
  "fat-loss":  { label: "Fat Loss",    color: "#f59e0b", description: "Dieting, body composition & metabolism" },
  hypertrophy: { label: "Hypertrophy", color: "#e1306c", description: "Muscle growth, volume & programming" },
  nutrition:   { label: "Nutrition",   color: "#10b981", description: "Macros, supplements & dietary science" },
};

export const CONTENT_TYPE_CONFIG: Record<
  ContentType,
  { label: string; color: string }
> = {
  research: { label: "Research", color: "#3b82f6" },
  tools:    { label: "Tools",    color: "#8b5cf6" },
  business: { label: "Business", color: "#f97316" },
};

// ── RSS Feeds ──────────────────────────────────────────────────────────────────

export const RSS_FEEDS: RssFeed[] = [
  { id: "sbs",   name: "Stronger by Science",           url: "https://www.strongerbyscience.com/feed/",             topic: "hypertrophy", contentType: "research", description: "Evidence-based strength & hypertrophy research",      articleCount: 6 },
  { id: "exam",  name: "Examine.com",                   url: "https://examine.com/rss.xml",                         topic: "nutrition",   contentType: "research", description: "Independent supplement & nutrition research",       articleCount: 7 },
  { id: "mass",  name: "MASS Research Review",          url: "https://www.massmember.com/feed",                     topic: "hypertrophy", contentType: "research", description: "Monthly applied sport science research digest",     articleCount: 4 },
  { id: "rp",    name: "Renaissance Periodization",     url: "https://rpstrength.com/blogs/articles.atom",          topic: "hypertrophy", contentType: "tools",    description: "Hypertrophy & periodization programming guides",   articleCount: 5 },
  { id: "bl",    name: "Biolayne",                      url: "https://biolayne.com/feed/",                          topic: "fat-loss",    contentType: "tools",    description: "Flexible dieting, fat loss & evidence-based lifting", articleCount: 5 },
  { id: "pn",    name: "Precision Nutrition",           url: "https://www.precisionnutrition.com/feed",             topic: "nutrition",   contentType: "tools",    description: "Applied nutrition coaching & habit-based strategies", articleCount: 5 },
  { id: "ath",   name: "Athletech News",                url: "https://athletechnews.com/feed/",                     topic: "fitness",     contentType: "business", description: "Fitness technology, industry deals & brand news",   articleCount: 5 },
  { id: "mcup",  name: "Morning Chalk Up",              url: "https://morningchalkup.com/feed/",                    topic: "fitness",     contentType: "business", description: "CrossFit culture, competition & fitness industry",  articleCount: 4 },
  { id: "ttt",   name: "Training Think Tank",           url: "https://trainingthinktank.com/feed/",                 topic: "fitness",     contentType: "tools",    description: "Periodization, coaching & athletic development",    articleCount: 4 },
  { id: "aarr",  name: "Alan Aragon Research Review",   url: "https://alanaragon.com/feed/",                        topic: "nutrition",   contentType: "research", description: "Evidence-based nutrition research monthly review",  articleCount: 4 },
];

// ── Article seed data ──────────────────────────────────────────────────────────

function ago(days: number, hours = 0): string {
  const d = new Date("2026-03-20T09:00:00Z");
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export const NEWS_ARTICLES: NewsArticle[] = [

  // ── HYPERTROPHY / RESEARCH ────────────────────────────────────────────────
  {
    id: "h1",
    headline: "Mechanical Tension vs. Metabolic Stress: New Data Clarifies the Primary Driver of Hypertrophy",
    summary: "A 12-week RCT comparing high-tension/low-metabolite protocols against low-tension/high-metabolite designs found significantly greater cross-sectional muscle area gains in the mechanical tension group. The findings challenge decades of emphasis on the 'pump' as a meaningful hypertrophic stimulus and suggest programming should prioritise load over metabolic fatigue.",
    source: "Stronger by Science", sourceId: "sbs",
    publishedAt: ago(0, 3), topic: "hypertrophy", contentType: "research", readMinutes: 14,
    tags: ["tension", "metabolic stress", "RCT", "muscle growth"],
  },
  {
    id: "h2",
    headline: "Rep Range Equivalence at True Failure: Updated Systematic Review of 47 Studies",
    summary: "A comprehensive meta-analysis pooling data from 47 trials confirms that when sets are taken to momentary muscular failure, rep ranges from 5 to 35 produce statistically equivalent hypertrophy. Practical take-aways for coaches include greater scheduling flexibility and reduced joint stress from periodically rotating into higher rep zones.",
    source: "MASS Research Review", sourceId: "mass",
    publishedAt: ago(1), topic: "hypertrophy", contentType: "research", readMinutes: 18,
    tags: ["rep range", "failure", "meta-analysis", "volume"],
  },
  {
    id: "h3",
    headline: "Training Frequency for Hypertrophy: Is Once Per Week Still Defensible?",
    summary: "Researchers directly compared 1×, 2×, and 3× per-muscle weekly frequency in trained subjects over 16 weeks. Volume was equated across conditions. While 2× outperformed 1×, 3× provided no additional benefit over 2×, suggesting the popular 'more frequency is always better' advice is overstated for most intermediate trainees.",
    source: "Stronger by Science", sourceId: "sbs",
    publishedAt: ago(2), topic: "hypertrophy", contentType: "research", readMinutes: 11,
    tags: ["frequency", "programming", "muscle protein synthesis"],
  },
  {
    id: "h4",
    headline: "Blood Flow Restriction Training: 2026 Protocol Update and Practical Application Guide",
    summary: "A new applied review updates BFR cuff pressure recommendations, confirms efficacy at 20–40% 1RM, and outlines the specific conditions under which BFR is most useful: injury rehab, deload weeks, and untrained populations. The authors caution against treating BFR as a primary hypertrophy stimulus for trained athletes.",
    source: "MASS Research Review", sourceId: "mass",
    publishedAt: ago(3), topic: "hypertrophy", contentType: "research", readMinutes: 9,
    tags: ["BFR", "blood flow restriction", "rehab", "occlusion"],
  },
  {
    id: "h5",
    headline: "Loaded Stretching for Hypertrophy: Programming Principles and the Lengthened Stimulus Debate",
    summary: "Recent evidence supporting lengthened partial reps has sparked significant interest in 'stretch-mediated hypertrophy'. This comprehensive guide breaks down what the research actually shows, which muscles respond most, appropriate loading parameters, and how to integrate lengthened-position work without accumulating excessive joint wear.",
    source: "Renaissance Periodization", sourceId: "rp",
    publishedAt: ago(4), topic: "hypertrophy", contentType: "tools", readMinutes: 16,
    tags: ["loaded stretch", "lengthened partials", "programming"],
  },
  {
    id: "h6",
    headline: "When to Train to Failure: Evidence-Based Decision Framework for Intermediate and Advanced Lifters",
    summary: "Not all sets benefit equally from being pushed to failure. This programming guide synthesises current evidence into a practical decision tree — accounting for compound vs. isolation exercises, proximity to competition, weekly volume loads, and recovery capacity — to help coaches determine when failure adds value and when it simply accumulates unnecessary fatigue.",
    source: "Renaissance Periodization", sourceId: "rp",
    publishedAt: ago(5), topic: "hypertrophy", contentType: "tools", readMinutes: 12,
    tags: ["failure training", "RIR", "fatigue management"],
  },
  {
    id: "h7",
    headline: "Understanding Stimulus-to-Fatigue Ratio: Practical Programming Implications",
    summary: "The SFR concept is widely cited but rarely operationalised with precision. This deep-dive defines SFR rigorously, examines the evidence base for per-exercise and per-session fatigue, and provides concrete programming heuristics for organising weekly training to maximise accumulated stimulus while keeping systemic fatigue within recoverable bounds.",
    source: "Renaissance Periodization", sourceId: "rp",
    publishedAt: ago(6), topic: "hypertrophy", contentType: "tools", readMinutes: 13,
    tags: ["SFR", "fatigue", "periodization", "volume"],
  },
  {
    id: "h8",
    headline: "The Science-Based Training Market Is Growing at 22% CAGR — What Coaches Are Buying",
    summary: "A new market analysis from Athletech shows that evidence-based online coaching platforms grew revenue by 22% in 2025, outpacing general fitness apps by 3×. The report profiles which certifications, software subscriptions, and content channels are capturing the growing segment of consumers who want cited, peer-reviewed fitness advice.",
    source: "Athletech News", sourceId: "ath",
    publishedAt: ago(3), topic: "hypertrophy", contentType: "business", readMinutes: 6,
    tags: ["coaching market", "online fitness", "industry growth"],
  },

  // ── NUTRITION / RESEARCH ──────────────────────────────────────────────────
  {
    id: "n1",
    headline: "Leucine Threshold Revisited: Is 2.5g Still the Right Target for Muscle Protein Synthesis?",
    summary: "New isotopic tracer studies suggest the per-meal leucine threshold for maximally stimulating muscle protein synthesis is both age-dependent and training-status dependent, with trained older adults requiring closer to 3–4g leucine per sitting. The findings have direct implications for protein source selection and meal composition in masters athletes.",
    source: "Examine.com", sourceId: "exam",
    publishedAt: ago(0, 6), topic: "nutrition", contentType: "research", readMinutes: 10,
    tags: ["leucine", "muscle protein synthesis", "thresholds", "masters"],
  },
  {
    id: "n2",
    headline: "Plant vs. Animal Protein for Body Composition: A 2026 Meta-Analysis of 38 RCTs",
    summary: "Pooling data from 38 randomised controlled trials, this meta-analysis found no statistically significant difference in lean mass accretion between plant and animal protein sources when total protein and leucine content are equated. The key moderating variable was leucine density, not protein source, reinforcing that protein quality is fundamentally about amino acid composition.",
    source: "Alan Aragon Research Review", sourceId: "aarr",
    publishedAt: ago(2), topic: "nutrition", contentType: "research", readMinutes: 15,
    tags: ["plant protein", "animal protein", "body composition", "meta-analysis"],
  },
  {
    id: "n3",
    headline: "Omega-3 Supplementation and Muscle Protein Synthesis: Updated Evidence Review",
    summary: "A new review of 22 clinical trials consolidates evidence that EPA/DHA supplementation augments the anabolic response to resistance exercise, with the most robust effects observed in older adults and in populations with low baseline omega-3 index. Effective doses cluster around 3–4g EPA+DHA daily, though response is blunted in those already consuming fatty fish ≥3× per week.",
    source: "Examine.com", sourceId: "exam",
    publishedAt: ago(4), topic: "nutrition", contentType: "research", readMinutes: 8,
    tags: ["omega-3", "EPA", "DHA", "muscle protein synthesis", "supplements"],
  },
  {
    id: "n4",
    headline: "Creatine Beyond Muscle: Cognitive Performance, Brain Health, and the Emerging Evidence Base",
    summary: "Creatine monohydrate has an established record for strength and power output, but a growing body of research now implicates creatine in brain energy metabolism. This review covers trials on working memory, executive function, and sleep deprivation resilience, noting that the effective cognitive doses (10–20g/day) are considerably higher than the standard 5g athletic protocol.",
    source: "Examine.com", sourceId: "exam",
    publishedAt: ago(5), topic: "nutrition", contentType: "research", readMinutes: 11,
    tags: ["creatine", "cognition", "brain health", "supplementation"],
  },
  {
    id: "n5",
    headline: "Carbohydrate Periodization for Strength Athletes: A Practitioner's Framework",
    summary: "Carbohydrate periodization — matching CHO intake to training demand across the microcycle — is well-established for endurance athletes but under-utilised in strength sports. This practical guide details how to implement high/moderate/low CHO days based on session RPE, volume load, and individual glycogen utilisation, with sample templates for powerlifters and physique athletes.",
    source: "Precision Nutrition", sourceId: "pn",
    publishedAt: ago(1), topic: "nutrition", contentType: "tools", readMinutes: 13,
    tags: ["carb periodization", "programming", "strength sports"],
  },
  {
    id: "n6",
    headline: "Meal Timing for Body Composition: Separating Signal from Noise",
    summary: "After decades of debate, the consensus position on meal timing has clarified significantly. This evidence summary finds that total daily protein and caloric intake remain the dominant variables, but a post-training protein dose within 2 hours meaningfully benefits older adults and fasted trainees. Precise intra-day carbohydrate timing shows minimal independent effect on body composition in free-living conditions.",
    source: "Alan Aragon Research Review", sourceId: "aarr",
    publishedAt: ago(7), topic: "nutrition", contentType: "tools", readMinutes: 9,
    tags: ["meal timing", "protein timing", "peri-workout nutrition"],
  },
  {
    id: "n7",
    headline: "Sports Nutrition Market Set to Hit $52B by 2028 as Protein Category Faces Saturation",
    summary: "The global sports nutrition market is projected to reach $52 billion by 2028, but growth is increasingly concentrated outside traditional whey protein, which faces margin compression and commoditisation. Analysts cite creatine, collagen, and functional hydration as the fastest-growing sub-segments, with brand differentiation shifting from ingredient science to sustainability credentials and convenience formats.",
    source: "Athletech News", sourceId: "ath",
    publishedAt: ago(2), topic: "nutrition", contentType: "business", readMinutes: 5,
    tags: ["sports nutrition market", "protein", "industry trends"],
  },
  {
    id: "n8",
    headline: "The Rise of Personalised Nutrition: AI, Continuous Glucose Monitors, and the Future of Dietetics",
    summary: "CGM data combined with AI-driven dietary modelling is enabling nutrition interventions tailored to an individual's glycaemic response rather than population averages. Early clinical trials show promising reductions in postprandial glucose variability, but researchers caution that individual CGM response is highly context-dependent and that precision nutrition still needs larger validation studies before displacing evidence-based population guidelines.",
    source: "Precision Nutrition", sourceId: "pn",
    publishedAt: ago(6), topic: "nutrition", contentType: "business", readMinutes: 7,
    tags: ["personalised nutrition", "CGM", "AI", "dietetics"],
  },

  // ── FAT LOSS / RESEARCH ───────────────────────────────────────────────────
  {
    id: "f1",
    headline: "Caloric Deficit Depth and Muscle Retention: Findings from a 16-Week RCT in Resistance-Trained Adults",
    summary: "Comparing 25%, 35%, and 45% caloric deficits in trained individuals, this trial found that deeper deficits accelerated fat loss but produced disproportionately higher lean mass loss. The 25% deficit group retained 94% of lean mass vs. 81% in the 45% group, suggesting aggressive cuts carry a meaningful muscle preservation cost even with high protein intakes.",
    source: "Examine.com", sourceId: "exam",
    publishedAt: ago(1), topic: "fat-loss", contentType: "research", readMinutes: 12,
    tags: ["caloric deficit", "lean mass", "body recomposition", "RCT"],
  },
  {
    id: "f2",
    headline: "Time-Restricted Eating vs. Caloric Restriction: A Head-to-Head 24-Week Comparison",
    summary: "This large RCT directly compared 8:16 TRE against continuous caloric restriction, equating total weekly calories. Both groups lost similar amounts of body fat and lean mass. TRE offered no metabolic advantage over conventional restriction but was associated with better adherence scores in individuals who skipped breakfast habitually, pointing to preference-matching as the dominant predictor of outcome.",
    source: "Examine.com", sourceId: "exam",
    publishedAt: ago(3), topic: "fat-loss", contentType: "research", readMinutes: 10,
    tags: ["TRE", "intermittent fasting", "caloric restriction", "adherence"],
  },
  {
    id: "f3",
    headline: "Adaptive Thermogenesis: Quantifying How Metabolism Adapts During Prolonged Energy Restriction",
    summary: "Using doubly labelled water, researchers tracked 48 subjects through a 20-week diet phase and found adaptive thermogenesis of 180–320 kcal/day beyond what weight loss alone would predict. The magnitude of adaptation correlated with speed of weight loss, initial body fat percentage, and leptin decline — providing a mechanistic basis for structured diet breaks and refeeds.",
    source: "Biolayne", sourceId: "bl",
    publishedAt: ago(4), topic: "fat-loss", contentType: "research", readMinutes: 13,
    tags: ["adaptive thermogenesis", "metabolism", "diet breaks", "NEAT"],
  },
  {
    id: "f4",
    headline: "NEAT: The Underestimated Variable in Long-Term Fat Loss and Weight Maintenance",
    summary: "Non-exercise activity thermogenesis accounts for 15–50% of total daily energy expenditure in sedentary to active individuals, yet it receives almost no attention in clinical weight loss programmes. This review quantifies NEAT's role in fat loss, explains why it declines disproportionately during deficits, and proposes structured NEAT targets as an adjunct to traditional caloric restriction.",
    source: "Alan Aragon Research Review", sourceId: "aarr",
    publishedAt: ago(5), topic: "fat-loss", contentType: "research", readMinutes: 11,
    tags: ["NEAT", "TDEE", "thermogenesis", "weight maintenance"],
  },
  {
    id: "f5",
    headline: "The Protein Leverage Hypothesis in Practice: Engineering High Satiety Diets Without Tracking",
    summary: "The protein leverage hypothesis proposes that humans overconsume total energy when dietary protein % is low, as the body continues eating in search of protein targets. This practical guide uses the hypothesis to design passive caloric reduction strategies — structuring meals around protein-dense anchors without explicit calorie counting — for clients resistant to tracking-based approaches.",
    source: "Precision Nutrition", sourceId: "pn",
    publishedAt: ago(2), topic: "fat-loss", contentType: "tools", readMinutes: 9,
    tags: ["protein leverage", "satiety", "protein density", "no-tracking"],
  },
  {
    id: "f6",
    headline: "Running a Fat Loss Phase Without Destroying Your Social Life: A Practical Coaching Guide",
    summary: "Adherence to a deficit breaks down most often at social events, restaurants, and holidays — contexts where clients have historically been told to 'be disciplined'. This coaching guide takes a different approach: building a flexible deficit structure that accounts for planned deviations, uses pre-event eating strategies, and treats social contexts as an adherence tool rather than a threat.",
    source: "Biolayne", sourceId: "bl",
    publishedAt: ago(6), topic: "fat-loss", contentType: "tools", readMinutes: 8,
    tags: ["adherence", "flexible dieting", "IIFYM", "social eating"],
  },
  {
    id: "f7",
    headline: "GLP-1 Agonists and the Fitness Industry: A Two-Year Market Retrospective",
    summary: "Semaglutide and its successors have reshaped weight loss demographics, bringing medically supervised fat loss to a broader market. This Athletech analysis quantifies the downstream effects on gym membership composition, personal training demand, and sports nutrition purchasing — while exploring whether GLP-1 users who maintain activity levels represent a net positive for the fitness industry.",
    source: "Athletech News", sourceId: "ath",
    publishedAt: ago(3), topic: "fat-loss", contentType: "business", readMinutes: 6,
    tags: ["GLP-1", "semaglutide", "weight loss", "fitness industry"],
  },
  {
    id: "f8",
    headline: "Weight Loss Apps Are Declining — What's Filling the Gap",
    summary: "Downloads of legacy calorie-tracking apps declined 18% in 2025 as users migrate toward AI coaching integrations, wearable-native tools, and GLP-1 medication management platforms. Morning Chalk Up profiles the five fastest-growing digital fat loss products and what their UX choices reveal about shifting consumer expectations around accountability, effort, and medical integration.",
    source: "Morning Chalk Up", sourceId: "mcup",
    publishedAt: ago(7), topic: "fat-loss", contentType: "business", readMinutes: 5,
    tags: ["weight loss apps", "digital health", "market shift"],
  },

  // ── FITNESS / RESEARCH ────────────────────────────────────────────────────
  {
    id: "fit1",
    headline: "Volume Thresholds Revisited: New Meta-Analysis Challenges Weekly Hard Sets Recommendations",
    summary: "A landmark meta-analysis across 63 studies re-examined the dose-response relationship between weekly training volume and hypertrophic outcomes. The authors found a significant plateau effect above ~20 hard sets per muscle per week in trained individuals, and warn that volume recommendations derived from untrained populations have been systematically over-extrapolated to experienced lifters.",
    source: "Stronger by Science", sourceId: "sbs",
    publishedAt: ago(1), topic: "fitness", contentType: "research", readMinutes: 16,
    tags: ["volume", "weekly sets", "dose-response", "meta-analysis"],
  },
  {
    id: "fit2",
    headline: "Sleep Deprivation and Athletic Performance: A Systematic Review of Recovery Protocols",
    summary: "Chronic sleep restriction to 6 hours degrades maximal strength by up to 8% and aerobic performance by 11% in controlled laboratory conditions. This systematic review evaluates the evidence for compensation strategies — napping, sleep banking, and pharmacological aids — finding that pre-sleep melatonin combined with structured nap timing produces the most consistent performance recovery in sleep-restricted athletes.",
    source: "Training Think Tank", sourceId: "ttt",
    publishedAt: ago(2), topic: "fitness", contentType: "research", readMinutes: 14,
    tags: ["sleep", "recovery", "performance", "melatonin"],
  },
  {
    id: "fit3",
    headline: "Deload Timing and Frequency: What the Current Evidence Actually Supports",
    summary: "Prescriptive deload schedules (every 4th or 6th week) have little experimental support. This updated review argues for auto-regulation-based deloads triggered by objective performance metrics rather than arbitrary calendar intervals, and presents evidence that trained individuals may benefit from deloads as infrequently as every 8–12 weeks when volume progression is managed conservatively.",
    source: "Stronger by Science", sourceId: "sbs",
    publishedAt: ago(4), topic: "fitness", contentType: "research", readMinutes: 12,
    tags: ["deload", "periodization", "fatigue management", "programming"],
  },
  {
    id: "fit4",
    headline: "Rate of Perceived Exertion Calibration: Why Most Lifters Under-Report Effort and How to Fix It",
    summary: "Studies consistently show that intermediate lifters underestimate proximity to failure by 3–5 reps when using RPE scales, leading to systematic underdosing of training stimulus. This practitioner guide details calibration protocols — including minimum velocity thresholds and failure set baselines — that improve RPE accuracy over a 4-week recalibration period.",
    source: "Training Think Tank", sourceId: "ttt",
    publishedAt: ago(3), topic: "fitness", contentType: "tools", readMinutes: 10,
    tags: ["RPE", "RIR", "effort calibration", "training tools"],
  },
  {
    id: "fit5",
    headline: "HRV Monitoring for Everyday Athletes: When the Data Helps and When to Ignore It",
    summary: "Heart rate variability has moved from elite sport labs into consumer wearables, but its practical value for recreational athletes remains debated. This evidence-based guide examines HRV's predictive validity for performance readiness, identifies the conditions under which HRV-guided training outperforms fixed schedules, and explains why a single HRV reading almost never justifies changing your planned session.",
    source: "Training Think Tank", sourceId: "ttt",
    publishedAt: ago(5), topic: "fitness", contentType: "tools", readMinutes: 11,
    tags: ["HRV", "recovery", "wearables", "readiness"],
  },
  {
    id: "fit6",
    headline: "Programming for Longevity: Evidence-Based Adjustments for Lifters Over 40",
    summary: "Ageing impairs satellite cell activation, increases connective tissue recovery time, and blunts anabolic hormone response to training — but none of these changes require abandoning heavy resistance training. This comprehensive guide details the evidence-based adjustments that matter (load management, frequency, technique modifications) and separates them from overcautious recommendations that unnecessarily restrict performance.",
    source: "Biolayne", sourceId: "bl",
    publishedAt: ago(6), topic: "fitness", contentType: "tools", readMinutes: 15,
    tags: ["longevity", "masters athletes", "ageing", "programming"],
  },
  {
    id: "fit7",
    headline: "Global Gym Membership Reaches 230 Million as Fitness Industry Posts $112B in Revenue",
    summary: "IHRSA's 2026 Global Report shows worldwide gym membership at 230 million — up 14% from 2023 — with total industry revenue crossing $112 billion for the first time. Growth is concentrated in Asia-Pacific and Latin America, while North American and European markets show saturation-driven consolidation, with mid-market chains losing share to both budget operators and premium boutique studios.",
    source: "Athletech News", sourceId: "ath",
    publishedAt: ago(1), topic: "fitness", contentType: "business", readMinutes: 5,
    tags: ["gym industry", "IHRSA", "global fitness", "revenue"],
  },
  {
    id: "fit8",
    headline: "Boutique vs. Budget: The Fitness Studio Landscape After Five Years of Disruption",
    summary: "Five years after the post-pandemic restructuring, the fitness studio market has stabilised into a clear barbell pattern: ultra-budget chains and premium boutiques are both growing, while mid-market operators continue to struggle. Morning Chalk Up breaks down membership economics, average revenue per user, and the technology investments separating winners from closures in each segment.",
    source: "Morning Chalk Up", sourceId: "mcup",
    publishedAt: ago(8), topic: "fitness", contentType: "business", readMinutes: 6,
    tags: ["boutique fitness", "studio industry", "market analysis"],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

export function formatRelativeDate(iso: string): string {
  const then = new Date(iso);
  const now = new Date("2026-03-20T12:00:00Z");
  const diffMs = now.getTime() - then.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);

  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD === 1) return "Yesterday";
  if (diffD < 7) return `${diffD}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export const ALL_TOPICS: NewsTopic[] = ["fitness", "fat-loss", "hypertrophy", "nutrition"];
export const ALL_CONTENT_TYPES: ContentType[] = ["research", "tools", "business"];
