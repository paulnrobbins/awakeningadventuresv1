# Awakening Adventures — Tier 3 inhabitable world

Forty-two acres of forest sanctuary on the Cumberland Plateau, rebuilt as a single-scroll immersive world. Hosted by Anthony &amp; Barb in Grandview, TN. Site built by Kingdom Digital Services.

> Phase 1 brief lives at `awakening-adventures-brief.md`. Read it first — it's the contract that governs every later phase.

## Stack

- Next.js 14 (App Router) · React 18 · TypeScript
- React Three Fiber + Drei + Postprocessing (R3F stack)
- Lenis (smooth scroll) + GSAP + ScrollTrigger (choreography)
- Howler.js (sound layer with mute toggle)
- Tailwind CSS with custom color/type tokens (no defaults reused)
- Three.js 0.169 with Draco + KTX2 compression for GLB models
- Self-Deploy via Vercel under Kingdom Digital Services

## Color lock

| Token | Hex | Use |
|---|---|---|
| `night` | `#0B0F14` | Dominant background (~70%) |
| `cream` | `#F2E9D8` | Off-white, body type |
| `amber` | `#C77A3A` | Single high-energy accent |
| `forest` | `#2C4A2E` | Environmental tint only (HDRI / fog), never UI |

## Type pair

- Display — **Bricolage Grotesque** (variable, Google Fonts, free)
- Body — **General Sans** (Fontshare, free)

Avoiding Fraunces, Reckless Neue, Instrument Serif (all used on recent KDS work), plus the Pillar 1 blacklist.

## Getting started

```bash
# inside this folder
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run type-check   # tsc --noEmit
```

## Fonts

Drop these files into `public/fonts/` before `npm run dev`:

```
public/fonts/
  BricolageGrotesque[opsz,wdth,wght].woff2
  GeneralSans-Regular.woff2
  GeneralSans-Medium.woff2
  GeneralSans-Semibold.woff2
```

- Bricolage Grotesque variable: <https://fonts.google.com/specimen/Bricolage+Grotesque>
- General Sans: <https://www.fontshare.com/fonts/general-sans>

The CSS fallback chain in `styles/tokens.css` keeps the page legible until the .woff2 files arrive.

## Phase status

| Phase | Status |
|---|---|
| 1 — Foundation (brief) | ✅ Done |
| 2 — Scaffolding & design tokens | ✅ Done (this commit) |
| 3 — Hero / Stargazer + scroll | ⏳ Next |
| 4a — Sanctuary (Scenes 2 + 3) | ⏳ |
| 4b — Lake (Scenes 4 + 5) | ⏳ |
| 4c — Welcome + Groups (Scenes 6 + 7) | ⏳ |
| 4d — Book (Scene 8) | ⏳ |
| 5 — Polish + mobile + perf + docs | ⏳ |

## Asset pipeline

Large assets do NOT live in this repo:

- **3D models** (GLB > 1MB): Cloudflare R2 or Vercel Blob. Set `NEXT_PUBLIC_ASSET_CDN` in `.env.local`. Compress before upload:
  ```bash
  npm run compress-models
  ```
- **HDRIs** (.hdr > 2MB): same CDN. Sourced from [Poly Haven](https://polyhaven.com), CC0.
- **Real photography**: curated from `StudioWork/Awakening Adventures/` into `/public/images/`. Phase 4 pulls specific files per scene.
- **Sound**: Freesound.org, CC0 / CC-BY. Drop into `/public/sound/`.

## Project structure

See `awakening-adventures-brief.md` (Phase 1) for the full canonical structure. Quick map:

```
app/                Next.js routes
components/
  sections/         Scene components (one per scroll scene)
  three/            R3F primitives (WorldCanvas + future models)
  layout/           Nav, Providers, PreloadGate
  ui/               Buttons, MuteToggle
lib/                gsap, lenis, sound, three helpers, utils
hooks/              useScrollProgress, useReducedMotion, useDeviceTier, useResponsive
styles/             tokens.css (source of truth for colors + type)
content/            accommodations, reviews, scene config
```
