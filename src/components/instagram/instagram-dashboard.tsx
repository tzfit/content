"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Clock3,
  FileText,
  CheckCircle2,
  Archive,
  LayoutGrid,
  Instagram,
} from "lucide-react";
import { Post, PostStatus, NewPostForm } from "@/types/instagram";
import { PostCard, STATUS_CONFIG, POST_TYPE_CONFIG } from "./post-card";
import { AddPostModal } from "./add-post-modal";

// ── Seed data ──────────────────────────────────────────────────────────────────

const SEED_POSTS: Post[] = [
  {
    id: "1",
    caption:
      "Thrilled to announce our spring collection is finally here! Each piece was thoughtfully designed with sustainability in mind. Shop the link in bio.",
    postType: "photo",
    status: "published",
    publishedDate: "2026-03-10",
    createdAt: "2026-03-08",
    hashtags: ["springcollection", "sustainable", "fashion", "newdrop"],
  },
  {
    id: "2",
    caption:
      "Behind the scenes from yesterday's shoot — couldn't be more proud of the team. Pure magic when everyone brings their A-game. 🎬",
    postType: "reel",
    status: "published",
    publishedDate: "2026-03-14",
    createdAt: "2026-03-13",
    hashtags: ["bts", "reels", "contentcreator"],
  },
  {
    id: "3",
    caption:
      "Your weekend reading list is here ✨ Swipe through our top 5 books for entrepreneurs that changed how we think about growth and creativity.",
    postType: "carousel",
    status: "scheduled",
    scheduledDate: "2026-03-22",
    createdAt: "2026-03-19",
    hashtags: ["books", "entrepreneur", "growthmindset", "weekendreads"],
  },
  {
    id: "4",
    caption:
      "Big announcement dropping this Friday — stay tuned. You won't want to miss this one. 👀",
    postType: "story",
    status: "scheduled",
    scheduledDate: "2026-03-24",
    createdAt: "2026-03-20",
    hashtags: [],
  },
  {
    id: "5",
    caption:
      "How we went from 0 to 50k followers in 6 months — an honest breakdown of our content strategy, what worked, and what flopped completely.",
    postType: "video",
    status: "scheduled",
    scheduledDate: "2026-03-28",
    createdAt: "2026-03-18",
    hashtags: ["instagramgrowth", "socialmediatips", "contentmarketing"],
  },
  {
    id: "6",
    caption:
      "Working on a new series about brand storytelling. First episode explores how small moments build lasting loyalty with your audience.",
    postType: "video",
    status: "draft",
    createdAt: "2026-03-20",
    hashtags: ["branding", "storytelling", "marketing"],
  },
  {
    id: "7",
    caption:
      "Product spotlight incoming — we've been refining this for months and it's almost ready. Caption and hashtags still WIP.",
    postType: "photo",
    status: "draft",
    createdAt: "2026-03-19",
    hashtags: [],
  },
  {
    id: "8",
    caption:
      "Earth Day campaign concept — community clean-up event coverage + brand alignment post. Need to confirm dates with the team first.",
    postType: "carousel",
    status: "backlog",
    createdAt: "2026-03-01",
    hashtags: ["earthday", "community", "sustainability"],
  },
  {
    id: "9",
    caption:
      "Customer testimonial series idea — feature 3–4 real customers per month sharing their journey. Authentic, no scripts.",
    postType: "video",
    status: "backlog",
    createdAt: "2026-02-25",
    hashtags: ["testimonial", "customerlove", "community"],
  },
  {
    id: "10",
    caption: "Holiday gift guide — start planning early for maximum reach and partnership opportunities.",
    postType: "carousel",
    status: "backlog",
    createdAt: "2026-02-20",
    hashtags: ["giftguide", "holidays", "gifting"],
  },
];

// ── Types ──────────────────────────────────────────────────────────────────────

type TabFilter = "all" | PostStatus;

interface Tab {
  id: TabFilter;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: "all", label: "All Posts", icon: LayoutGrid },
  { id: "scheduled", label: "Scheduled", icon: Clock3 },
  { id: "draft", label: "Drafts", icon: FileText },
  { id: "published", label: "Published", icon: CheckCircle2 },
  { id: "backlog", label: "Backlog", icon: Archive },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function parseHashtags(raw: string): string[] {
  return raw
    .split(/[\s,]+/)
    .map((t) => t.replace(/^#+/, "").trim())
    .filter(Boolean);
}

// ── Component ──────────────────────────────────────────────────────────────────

export function InstagramDashboard() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Counts per status
  const counts = useMemo(() => {
    const map: Record<PostStatus, number> = {
      draft: 0,
      scheduled: 0,
      published: 0,
      backlog: 0,
    };
    posts.forEach((p) => map[p.status]++);
    return map;
  }, [posts]);

  // Filtered list
  const filtered = useMemo(() => {
    let list = posts;
    if (activeTab !== "all") list = list.filter((p) => p.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.caption.toLowerCase().includes(q) ||
          p.hashtags.some((h) => h.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, activeTab, search]);

  function handleSave(form: NewPostForm, editId?: string) {
    const hashtags = parseHashtags(form.hashtags);
    if (editId) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editId
            ? {
                ...p,
                caption: form.caption,
                postType: form.postType,
                status: form.status,
                scheduledDate: form.scheduledDate || undefined,
                publishedDate:
                  form.status === "published" ? (p.publishedDate ?? todayStr()) : p.publishedDate,
                hashtags,
              }
            : p
        )
      );
    } else {
      const newPost: Post = {
        id: generateId(),
        caption: form.caption,
        postType: form.postType,
        status: form.status,
        scheduledDate: form.scheduledDate || undefined,
        publishedDate: form.status === "published" ? todayStr() : undefined,
        createdAt: todayStr(),
        hashtags,
      };
      setPosts((prev) => [newPost, ...prev]);
    }
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleStatusChange(id: string, status: PostStatus) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              publishedDate: status === "published" ? (p.publishedDate ?? todayStr()) : p.publishedDate,
            }
          : p
      )
    );
  }

  function openAdd() {
    setEditingPost(null);
    setModalOpen(true);
  }

  function openEdit(post: Post) {
    setEditingPost(post);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-8 py-6 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #e1306c, #f77737)" }}
          >
            <Instagram size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
              Instagram Manager
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {posts.length} post{posts.length !== 1 ? "s" : ""} in your pipeline
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, #e1306c, #f77737)", color: "white" }}
        >
          <Plus size={16} />
          Add Post
        </button>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────────────────── */}
      <div
        className="grid grid-cols-4 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        {(["scheduled", "draft", "published", "backlog"] as PostStatus[]).map((st) => {
          const conf = STATUS_CONFIG[st];
          const SI = conf.Icon;
          return (
            <button
              key={st}
              onClick={() => setActiveTab(st)}
              className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-white/3 border-r last:border-r-0"
              style={{
                borderColor: "var(--border)",
                backgroundColor: activeTab === st ? conf.bg : "transparent",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: conf.bg }}
              >
                <SI size={15} style={{ color: conf.color }} />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold leading-none" style={{ color: conf.color }}>
                  {counts[st]}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {conf.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Toolbar: tabs + search ───────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-8 py-3 border-b shrink-0 gap-4"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Tabs */}
        <div className="flex items-center gap-0.5">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            const count =
              tab.id === "all" ? posts.length : counts[tab.id as PostStatus];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  backgroundColor: isActive ? "var(--secondary)" : "transparent",
                  color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                }}
              >
                <TabIcon size={13} />
                {tab.label}
                <span
                  className="px-1.5 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: isActive ? "var(--muted)" : "transparent",
                    color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            backgroundColor: "var(--secondary)",
            border: "1px solid var(--border)",
            minWidth: 220,
          }}
        >
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Search captions, hashtags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs outline-none flex-1"
            style={{ color: "var(--foreground)" }}
          />
        </div>
      </div>

      {/* ── Content grid ────────────────────────────────────────────────────── */}
      <div className="flex-1 p-8 overflow-auto">
        {filtered.length === 0 ? (
          <EmptyState tab={activeTab} onAdd={openAdd} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onEdit={openEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ───────────────────────────────────────────────────────────── */}
      <AddPostModal
        isOpen={modalOpen}
        editingPost={editingPost}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ tab, onAdd }: { tab: TabFilter; onAdd: () => void }) {
  const messages: Record<TabFilter, { title: string; body: string }> = {
    all: { title: "No posts yet", body: "Start by adding your first post idea." },
    scheduled: {
      title: "Nothing scheduled",
      body: "Add a post and set its status to Scheduled to see it here.",
    },
    draft: {
      title: "No drafts",
      body: "Create a draft when you have a post idea but aren't ready to schedule it.",
    },
    published: {
      title: "Nothing published yet",
      body: "Move posts to Published once they go live.",
    },
    backlog: {
      title: "Backlog is empty",
      body: "Add ideas here that you want to revisit later.",
    },
  };

  const { title, body } = messages[tab];

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #e1306c20, #f7773720)" }}
      >
        <Instagram size={28} style={{ color: "#e1306c" }} />
      </div>
      <div className="text-center">
        <p className="font-semibold" style={{ color: "var(--foreground)" }}>
          {title}
        </p>
        <p className="text-sm mt-1 max-w-xs" style={{ color: "var(--muted-foreground)" }}>
          {body}
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #e1306c, #f77737)", color: "white" }}
      >
        <Plus size={15} />
        Add Post
      </button>
    </div>
  );
}
