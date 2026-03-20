export type PostType = "photo" | "video" | "reel" | "story" | "carousel";

export type PostStatus = "draft" | "scheduled" | "published" | "backlog";

export interface Post {
  id: string;
  caption: string;
  postType: PostType;
  status: PostStatus;
  scheduledDate?: string; // ISO date string YYYY-MM-DD
  publishedDate?: string;
  createdAt: string;
  hashtags: string[];
}

export interface NewPostForm {
  caption: string;
  postType: PostType;
  status: PostStatus;
  scheduledDate: string;
  hashtags: string;
}
