"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock3,
  FileText,
  Archive,
  Trash2,
  Image,
  Play,
  Film,
  Circle,
  LayoutGrid,
} from "lucide-react";
import { Post, PostStatus, PostType } from "@/types/instagram";
import { cn } from "@/lib/utils";

// ── Config maps ────────────────────────────────────────────────────────────────

export const POST_TYPE_CONFIG: Record<
  PostType,
  { label: string; gradient: string; Icon: React.ElementType; color: string }
> = {
  photo: {
    label: "Photo",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    Icon: Image,
    color: "#667eea",
  },
  video: {
    label: "Video",
    gradient: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
    Icon: Play,
    color: "#2563eb",
  },
  reel: {
    label: "Reel",
    gradient: "linear-gradient(135deg, #e1306c 0%, #f77737 100%)",
    Icon: Film,
    color: "#e1306c",
  },
  story: {
    label: "Story",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)",
    Icon: Circle,
    color: "#f59e0b",
  },
  carousel: {
    label: "Carousel",
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    Icon: LayoutGrid,
    color: "#10b981",
  },
};

export const STATUS_CONFIG: Record<
  PostStatus,
  { label: string; color: string; bg: string; Icon: React.ElementType }
> = {
  draft: {
    label: "Draft",
    color: "#94a3b8",
    bg: "#94a3b820",
    Icon: FileText,
  },
  scheduled: {
    label: "Scheduled",
    color: "#818cf8",
    bg: "#818cf820",
    Icon: Clock3,
  },
  published: {
    label: "Published",
    color: "#34d399",
    bg: "#34d39920",
    Icon: CheckCircle2,
  },
  backlog: {
    label: "Backlog",
    color: "#fcd34d",
    bg: "#fcd34d20",
    Icon: Archive,
  },
};

const STATUS_ORDER: PostStatus[] = ["draft", "scheduled", "published", "backlog"];

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Component ──────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: PostStatus) => void;
  onEdit: (post: Post) => void;
}

export function PostCard({ post, onDelete, onStatusChange, onEdit }: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const typeConf = POST_TYPE_CONFIG[post.postType];
  const statusConf = STATUS_CONFIG[post.status];
  const TypeIcon = typeConf.Icon;
  const StatusIcon = statusConf.Icon;

  const displayDate =
    post.status === "published"
      ? post.publishedDate
      : post.status === "scheduled"
      ? post.scheduledDate
      : post.createdAt;

  const dateLabel =
    post.status === "published"
      ? "Published"
      : post.status === "scheduled"
      ? "Scheduled"
      : "Created";

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div
      className="rounded-xl border flex flex-col overflow-hidden group transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }}
    >
      {/* Image placeholder */}
      <div
        className="relative h-44 flex items-center justify-center shrink-0"
        style={{ background: typeConf.gradient }}
      >
        {/* Post type icon */}
        <div className="flex flex-col items-center gap-2 opacity-70">
          <TypeIcon size={32} color="white" strokeWidth={1.5} />
          <span className="text-white text-xs font-medium tracking-wide uppercase opacity-80">
            {typeConf.label}
          </span>
        </div>

        {/* Status pill overlay */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.45)", color: statusConf.color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: statusConf.color }}
          />
          {statusConf.label}
        </div>

        {/* 3-dot menu button */}
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-opacity backdrop-blur-sm",
              menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            aria-label="Post options"
          >
            <MoreVertical size={14} color="white" />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              className="absolute top-9 right-0 w-48 rounded-lg border shadow-xl z-20 overflow-hidden py-1"
              style={{ backgroundColor: "#1a2234", borderColor: "var(--border)" }}
            >
              <button
                onClick={() => { onEdit(post); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-left transition-colors hover:bg-white/5"
                style={{ color: "var(--foreground)" }}
              >
                <FileText size={13} style={{ color: "var(--muted-foreground)" }} />
                Edit post
              </button>
              <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} />
              <p className="px-3.5 py-1 text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                Move to
              </p>
              {STATUS_ORDER.filter((s) => s !== post.status).map((s) => {
                const sc = STATUS_CONFIG[s];
                const SI = sc.Icon;
                return (
                  <button
                    key={s}
                    onClick={() => { onStatusChange(post.id, s); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-left transition-colors hover:bg-white/5"
                    style={{ color: "var(--foreground)" }}
                  >
                    <SI size={13} style={{ color: sc.color }} />
                    {sc.label}
                  </button>
                );
              })}
              <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} />
              <button
                onClick={() => { onDelete(post.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-left transition-colors hover:bg-red-500/10"
                style={{ color: "#f87171" }}
              >
                <Trash2 size={13} />
                Delete post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Caption */}
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "var(--foreground)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.caption || <span style={{ color: "var(--muted-foreground)" }}>No caption</span>}
        </p>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.hashtags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: typeConf.color + "18", color: typeConf.color }}
              >
                #{tag.replace(/^#/, "")}
              </span>
            ))}
            {post.hashtags.length > 3 && (
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: "var(--muted-foreground)" }}>
                +{post.hashtags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 mt-auto border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} style={{ color: "var(--muted-foreground)" }} />
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {dateLabel} {formatDate(displayDate)}
            </span>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: statusConf.bg, color: statusConf.color }}
          >
            <StatusIcon size={10} />
            {statusConf.label}
          </div>
        </div>
      </div>
    </div>
  );
}
