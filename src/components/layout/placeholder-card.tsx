import { LucideIcon } from "lucide-react";

interface PlaceholderCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function PlaceholderCard({ icon: Icon, title, description }: PlaceholderCardProps) {
  return (
    <div
      className="rounded-lg border p-6 flex flex-col gap-3"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div
        className="w-10 h-10 rounded-md flex items-center justify-center"
        style={{ backgroundColor: "var(--secondary)" }}
      >
        <Icon size={20} style={{ color: "var(--primary)" }} />
      </div>
      <div>
        <h3 className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
          {title}
        </h3>
        <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
          {description}
        </p>
      </div>
      <div
        className="h-24 rounded-md mt-1"
        style={{ backgroundColor: "var(--secondary)" }}
      />
    </div>
  );
}
