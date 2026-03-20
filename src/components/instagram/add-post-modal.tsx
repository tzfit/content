"use client";

import { useEffect, useRef, useState } from "react";
import { X, Image, Play, Film, Circle, LayoutGrid, AlertCircle } from "lucide-react";
import { Post, PostStatus, PostType, NewPostForm } from "@/types/instagram";
import { POST_TYPE_CONFIG, STATUS_CONFIG } from "./post-card";
import { cn } from "@/lib/utils";

const POST_TYPES: PostType[] = ["photo", "video", "reel", "story", "carousel"];
const STATUSES: PostStatus[] = ["draft", "scheduled", "backlog", "published"];

const EMPTY_FORM: NewPostForm = {
  caption: "",
  postType: "photo",
  status: "draft",
  scheduledDate: "",
  hashtags: "",
};

interface AddPostModalProps {
  isOpen: boolean;
  editingPost: Post | null;
  onClose: () => void;
  onSave: (form: NewPostForm, editId?: string) => void;
}

export function AddPostModal({ isOpen, editingPost, onClose, onSave }: AddPostModalProps) {
  const [form, setForm] = useState<NewPostForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof NewPostForm, string>>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Populate form when editing
  useEffect(() => {
    if (editingPost) {
      setForm({
        caption: editingPost.caption,
        postType: editingPost.postType,
        status: editingPost.status,
        scheduledDate: editingPost.scheduledDate ?? "",
        hashtags: editingPost.hashtags.join(" "),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingPost, isOpen]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  function validate(): boolean {
    const errs: Partial<Record<keyof NewPostForm, string>> = {};
    if (!form.caption.trim()) errs.caption = "Caption is required.";
    if (form.status === "scheduled" && !form.scheduledDate)
      errs.scheduledDate = "A date is required for scheduled posts.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSave(form, editingPost?.id);
    onClose();
  }

  function update<K extends keyof NewPostForm>(key: K, value: NewPostForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  if (!isOpen) return null;

  const selectedTypeConf = POST_TYPE_CONFIG[form.postType];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col shadow-2xl"
        style={{ backgroundColor: "#0d1117", borderLeft: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2 className="font-semibold text-base" style={{ color: "var(--foreground)" }}>
              {editingPost ? "Edit Post" : "New Post"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {editingPost ? "Update the post details below" : "Fill in the details to add a post to your pipeline"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Preview strip */}
        <div
          className="flex items-center gap-3 px-6 py-3 border-b shrink-0"
          style={{
            background: selectedTypeConf.gradient,
            borderColor: "transparent",
            opacity: 0.85,
          }}
        >
          {(() => {
            const I = selectedTypeConf.Icon;
            return <I size={18} color="white" strokeWidth={1.5} />;
          })()}
          <div>
            <p className="text-xs font-semibold text-white">{selectedTypeConf.label}</p>
            <p className="text-xs text-white/70">
              {form.status
                ? STATUS_CONFIG[form.status].label
                : "Draft"}
            </p>
          </div>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Caption */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium" style={{ color: "var(--foreground)" }}>
              Caption <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              ref={textareaRef}
              rows={5}
              placeholder="Write your caption here…"
              value={form.caption}
              onChange={(e) => update("caption", e.target.value)}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm resize-none outline-none transition-all"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--foreground)",
                border: errors.caption
                  ? "1px solid #ef4444"
                  : "1px solid var(--border)",
              }}
              onFocus={(e) => {
                if (!errors.caption)
                  (e.target as HTMLTextAreaElement).style.borderColor = "var(--primary)";
              }}
              onBlur={(e) => {
                if (!errors.caption)
                  (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)";
              }}
            />
            <div className="flex items-center justify-between">
              {errors.caption ? (
                <p className="flex items-center gap-1 text-xs" style={{ color: "#f87171" }}>
                  <AlertCircle size={11} /> {errors.caption}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {form.caption.length} chars
              </span>
            </div>
          </div>

          {/* Post type */}
          <div className="space-y-2">
            <label className="block text-xs font-medium" style={{ color: "var(--foreground)" }}>
              Post Type
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {POST_TYPES.map((pt) => {
                const conf = POST_TYPE_CONFIG[pt];
                const I = conf.Icon;
                const isActive = form.postType === pt;
                return (
                  <button
                    key={pt}
                    onClick={() => update("postType", pt)}
                    className="flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-xs font-medium transition-all"
                    style={{
                      backgroundColor: isActive ? conf.color + "20" : "var(--secondary)",
                      borderColor: isActive ? conf.color : "var(--border)",
                      color: isActive ? conf.color : "var(--muted-foreground)",
                    }}
                  >
                    <I size={16} />
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-xs font-medium" style={{ color: "var(--foreground)" }}>
              Status
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {STATUSES.map((st) => {
                const conf = STATUS_CONFIG[st];
                const I = conf.Icon;
                const isActive = form.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => update("status", st)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all"
                    style={{
                      backgroundColor: isActive ? conf.bg : "var(--secondary)",
                      borderColor: isActive ? conf.color : "var(--border)",
                      color: isActive ? conf.color : "var(--muted-foreground)",
                    }}
                  >
                    <I size={14} />
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scheduled date — only shown when status is scheduled */}
          <div
            className="overflow-hidden transition-all duration-200"
            style={{ maxHeight: form.status === "scheduled" ? "120px" : "0px", opacity: form.status === "scheduled" ? 1 : 0 }}
          >
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-medium" style={{ color: "var(--foreground)" }}>
                Scheduled Date <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="date"
                value={form.scheduledDate}
                onChange={(e) => update("scheduledDate", e.target.value)}
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--foreground)",
                  border: errors.scheduledDate
                    ? "1px solid #ef4444"
                    : "1px solid var(--border)",
                  colorScheme: "dark",
                }}
              />
              {errors.scheduledDate && (
                <p className="flex items-center gap-1 text-xs" style={{ color: "#f87171" }}>
                  <AlertCircle size={11} /> {errors.scheduledDate}
                </p>
              )}
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium" style={{ color: "var(--foreground)" }}>
              Hashtags{" "}
              <span className="font-normal" style={{ color: "var(--muted-foreground)" }}>
                (optional, space-separated)
              </span>
            </label>
            <input
              type="text"
              placeholder="#fitness #lifestyle #motivation"
              value={form.hashtags}
              onChange={(e) => update("hashtags", e.target.value)}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "var(--primary)")
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "var(--border)")
              }
            />
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Separate with spaces. # prefix is optional.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: "var(--muted-foreground)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#e1306c", color: "white" }}
          >
            {editingPost ? "Save Changes" : "Add Post"}
          </button>
        </div>
      </div>
    </>
  );
}
