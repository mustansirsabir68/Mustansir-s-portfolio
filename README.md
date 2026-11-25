# Mustansir Sabir — Portfolio (redesign)

Personal site for Mustansir Sabir, a software engineer working across the Microsoft
.NET ecosystem: full-stack development, performance optimization and enterprise
security.

This version replaces the previous RetroUI/pixel theme with a dark "engineering
console" direction — precise type, a single lime signal color, measured numbers,
and motion that explains rather than decorates.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the build
```

## Design direction

- **Surface:** near-black `#08090c`, hairline borders, and a fine masked grid,
  closer to a system dashboard than a marketing template.
- **Type:** Inter Tight for display and emphasis (weight and italic of the same
  family, no decorative serif), JetBrains Mono for labels and metadata.
- **Signal:** one accent (`#c9f24e`) used for status, metrics and primary actions.
- **Motion:** scroll reveals, count-ups on the metrics band, pointer-tracked
  spotlight cards, a 3D tilt on project art. All motion is disabled under
  `prefers-reduced-motion` (CSS + `MotionConfig`).
- **Themes:** dark by default, with a light "paper" theme behind the toggle in
  the nav. The active theme persists in `localStorage` and is applied before
  first paint, so a light session never flashes dark.

## Hero: 21st.dev component

The homepage hero is `src/components/ui/shadcn-studio-hero-section-44.tsx`, a
copy of the 21st.dev **shadcn-studio hero section 44**: rotating greeting,
availability pill, CTAs, technology marquee, and a physics-driven lanyard ID
card that can be dragged.

It is wired to real content in `src/components/site/lanyard-hero.jsx`. The card
uses `src/assets/images/photo.png`, and the marquee uses Simple Icons for the
actual stack (C#, Blazor, React, JavaScript, Git, Vite, GitHub, NuGet). The
SVGs are bundled in `src/assets/images/tech/` rather than hot-linked, and are
recoloured in CSS: grey on coal, near-black ink on paper, so they stay legible
in both themes.

The 3D stack (`three`, `@react-three/fiber`, `@react-three/drei`,
`@react-three/rapier`) is ~1.1 MB gzipped, so the card is loaded as a lazy
chunk after the hero copy paints. The same draggable badge runs at every size:
beside the copy from `lg` up, and in flow under the CTAs on phones and tablets,
where the camera reframes itself to fit the shorter canvas and the canvas takes
touch drags directly. The cord is drawn as a physics-followed cylinder rather
than a per-frame Frenet tube, which removes an intermittent
degenerate-geometry artifact.

## shadcn / TypeScript setup

The project was JSX-only, so the registry foundation was added without
converting existing files:

- `components.json` — shadcn CLI config (`new-york`, CSS variables, `@/` aliases)
- `tsconfig.json` — `allowJs`, `checkJs: false`, `jsx: react-jsx`, `@/*` paths
- `vite.config.js` — `@` alias and the Tailwind v4 plugin
- `src/index.css` — semantic tokens (`background`, `foreground`, `card`,
  `primary`, `muted`, `muted-foreground`, `border`, `ring`) mapped onto the
  site's coal/paper/lime palette, so pasted components inherit the theme
- The site's gray text token was renamed `muted` → `ash` to avoid colliding with
  shadcn's `bg-muted` surface token

React was upgraded to 19 (required by `@react-three/fiber` 9), and the unused
RetroUI-era dependencies (`pixel-retroui`, `wow.js`, `react-slick`,
`react-countup`, `react-intersection-observer`, `react-color`,
`react-thumbnail`, `emailjs-com`) were removed.

## Components (21st.dev patterns)

21st.dev distributes copy-paste React/Tailwind components rather than a runtime
package, so the patterns are implemented locally in `src/components/ui/` to keep
the build dependency-free and fully editable:

| File | Pattern |
| --- | --- |
| `spotlight.jsx` | Pointer-following spotlight card |
| `reveal.jsx` | Blur-fade reveal and viewport `Counter` |
| `tilt.jsx` | Spring-based 3D tilt with pointer glare |
| `button.jsx` | `SectionHeading` (optional kicker, same-family italic accent) |
| `theme-toggle.jsx` | Dark/light switch, persisted and applied pre-paint |
| `scroll-progress.jsx` | Scroll-linked progress bar |
| `brand-icons.jsx` | GitHub / LinkedIn marks (lucide v1 removed brand icons) |

## Structure

```
src/
  App.jsx                     routes: / and /assistant
  main.jsx                    entry, imports index.css
  index.css                   Tailwind v4 theme tokens, base, utilities, keyframes
  your_info.jsx               all personal content (single source of truth)
  config.js                   LLM API base URL
  components/
    site/                     nav, lanyard-hero, expertise, metrics, work,
                              about, contact, footer, floating-assistant
    assistant/assistant-page  full-page AI chat + résumé match
    ui/                       the primitives above, including the lanyard card
  assets/images/              project art, portrait, optimized preview video
```

## Content

Everything personal lives in `src/your_info.jsx`: name, résumé URL, social
profiles, three capability areas, projects, bio and slogan. Editing that file
updates the whole site.

Facts shown in the hero spec card and metrics band come from that content:
4 years of experience, 95% on-time delivery, 73% query-time reduction and 99.9%
uptime. Nothing is invented for the design.

Project media is optimized: the portfolio screen recording was converted from a
5.6 MB GIF to an 800 KB MP4 (autoplay, muted, looped, with a JPG poster), and the
FMB screenshot from a 1.1 MB PNG to a 95 KB WebP.

## Features

- Sticky glass navigation, mobile menu, scroll progress, section anchors
- Dark/light theme toggle, persisted across visits and applied before paint
- Hero with a rotating greeting and a draggable physics ID card at every size
- Capability cards, high-contrast metrics band with count-ups
- Alternating project case studies with video/image previews and source links
- About with photo treatment, pull-quote and quick facts
- Contact form posting to the existing `POST /send` endpoint
- Floating "Ask AI" widget posting to `POST /predict`
- `/assistant` page: full chat, suggested prompts, and résumé match analysis
  (`POST /match`) rendered with a score ring
- Responsive from 360 px up; skip link, focus rings, reduced-motion support

## Backend

The AI and contact features depend on the service in `src/config.js`
(`https://mustansir-llm-api.onrender.com`). If it is asleep or unavailable, the
UI shows a friendly inline error instead of failing silently. The contact form
sends `name`, `email` and `message` as form-urlencoded data.

## Deploy

`npm run build` outputs a static `dist/`. Any static host works (Vercel/Netlify);
`vercel.json` rewrites are already configured for the `/assistant` client route.
