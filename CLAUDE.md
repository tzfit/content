@AGENTS.md

# CMS Dashboard — Developer Reference

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui pattern (manually scaffolded) |
| Icons | lucide-react |
| Utilities | clsx + tailwind-merge via `cn()` helper |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — mounts Sidebar + main wrapper
│   ├── page.tsx            # Dashboard home (stats + section cards)
│   ├── globals.css         # Global CSS variables (dark theme) + base styles
│   ├── analytics/
│   │   └── page.tsx
│   ├── calendar/
│   │   └── page.tsx
│   ├── competitors/
│   │   └── page.tsx
│   ├── instagram/
│   │   └── page.tsx
│   └── news/
│       └── page.tsx
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         # Shared sidebar navigation (client component)
│   │   ├── page-header.tsx     # Shared page header with title/description slot
│   │   └── placeholder-card.tsx # Reusable placeholder card for section features
│   └── ui/                     # shadcn/ui components go here (Button, Card, etc.)
└── lib/
    └── utils.ts                # cn() helper: clsx + tailwind-merge
```

## Sections

| Route | Section |
|-------|---------|
| `/` | Dashboard (overview) |
| `/instagram` | Instagram Manager |
| `/analytics` | Analytics |
| `/calendar` | Content Calendar |
| `/competitors` | Competitor Tracker |
| `/news` | News Consolidator |

## Theming

The app uses a **forced dark theme** defined entirely via CSS custom properties in `globals.css`. There is no light mode toggle — all colors reference `var(--*)` tokens directly on elements.

Key CSS variables:

```css
--background      /* Page background (#0a0a0f) */
--foreground      /* Primary text (#e2e8f0) */
--card            /* Card surface (#111827) */
--secondary       /* Muted surface / skeleton (#1e293b) */
--muted-foreground /* Subdued text (#64748b) */
--primary         /* Brand / accent (#6366f1) */
--border          /* Border color (#1e293b) */
--sidebar         /* Sidebar background (#0d1117) */
--sidebar-active  /* Active nav item background (#6366f1) */
```

## Component Conventions

- **Server Components by default.** Only add `"use client"` when needed (e.g. `usePathname` in Sidebar).
- **CSS variables over Tailwind color classes.** Use `style={{ color: "var(--foreground)" }}` rather than `className="text-slate-200"` to stay consistent with the theme system.
- **Section accent colors** are defined per-section (e.g. `#e1306c` for Instagram, `#6366f1` for Analytics). Use `color + "20"` for transparent backgrounds.
- **PageHeader** is used at the top of every section page — import from `@/components/layout/page-header`.
- **shadcn/ui components** should be added to `src/components/ui/`. The `cn()` helper in `src/lib/utils.ts` follows the standard shadcn pattern.

## Adding a New Section

1. Create `src/app/<section>/page.tsx`
2. Add a nav entry to the `navItems` array in `src/components/layout/sidebar.tsx`
3. Add a section card to the dashboard home in `src/app/page.tsx`

## Key Decisions

- **Google Fonts removed** — `next/font/google` was dropped because the build environment has no external network access. System font stack is used instead.
- **No shadcn CLI** — The CLI requires access to `ui.shadcn.com` which was unavailable. Components follow the same patterns and can be added manually to `src/components/ui/`.
- **Tailwind CSS v4** — Uses the new `@import "tailwindcss"` syntax (no `tailwind.config.js` needed for basic usage).
- **Static export** — All pages are currently static (no server-side data fetching). API integrations will require converting pages to dynamic routes.
