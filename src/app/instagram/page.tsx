import { PageHeader } from "@/components/layout/page-header";
import { Instagram, ImagePlus, Video, BarChart2, Settings } from "lucide-react";

const features = [
  {
    icon: ImagePlus,
    title: "Post Manager",
    description: "Create, edit, and schedule Instagram posts with caption and hashtag management.",
  },
  {
    icon: Video,
    title: "Reels & Stories",
    description: "Manage short-form video content and story sequences for your account.",
  },
  {
    icon: BarChart2,
    title: "Post Analytics",
    description: "View per-post reach, impressions, likes, and comment performance.",
  },
  {
    icon: Settings,
    title: "Account Settings",
    description: "Connect and manage your Instagram business account via the Graph API.",
  },
];

export default function InstagramPage() {
  return (
    <div>
      <PageHeader
        title="Instagram Manager"
        description="Manage your Instagram content, scheduling, and account settings"
      />

      <div className="p-8 space-y-8">
        {/* Connection prompt */}
        <div
          className="rounded-lg border border-dashed p-10 flex flex-col items-center gap-4 text-center"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#e1306c20" }}
          >
            <Instagram size={28} style={{ color: "#e1306c" }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--foreground)" }}>
              Connect your Instagram account
            </p>
            <p className="text-sm mt-1 max-w-sm" style={{ color: "var(--muted-foreground)" }}>
              Link your Instagram Business account via the Meta Graph API to start managing content from here.
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#e1306c", color: "white" }}
          >
            Connect Account
          </button>
        </div>

        {/* Feature cards */}
        <div>
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--muted-foreground)" }}>
            Features
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-lg border p-5 flex items-start gap-4"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <div
                    className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--secondary)" }}
                  >
                    <Icon size={18} style={{ color: "#e1306c" }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                      {feature.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
