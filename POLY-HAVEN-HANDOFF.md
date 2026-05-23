# Poly Haven HDRI handoff

Phase 3 ships with the `Environment` component pointing at `moonless_golf_2k.hdr` for the hero. If the file isn't in `public/hdri/` the Suspense boundary catches the load failure and the scene still renders — just without image-based lighting.

For the real "Tennessee night" feel, drop the four HDRIs below into `public/hdri/`. All four are free, CC0 (public domain), no attribution required.

## Files needed (already named in `content/scenes.ts`)

| Filename | Scene | Why this one |
|---|---|---|
| `moonless_golf_2k.hdr` | 0 Arrival, 6 Groups, 7 Book | Real-world moonless night sky, slight ambient on horizon. The hero HDRI. |
| `kiara_1_dawn_2k.hdr` | 1 Sanctuary | Pre-dawn warm horizon, low sun — sells "first light over the property" |
| `kloofendal_43d_clear_2k.hdr` | 2 Stay | Clear sky with directional light — accommodation reveal scenes need crisp shadows |
| `forest_slope_2k.hdr` | 3 Trails | Inside-the-forest HDRI with filtered light shafts |
| `golden_gate_hills_2k.hdr` | 4 Lake | Sunset on water |
| `studio_small_09_2k.hdr` | 5 Welcome | Warm interior tone for the fire-pit scene |

## How to download

The fastest path is the per-file download page. URLs:

- https://polyhaven.com/a/moonless_golf
- https://polyhaven.com/a/kiara_1_dawn
- https://polyhaven.com/a/kloofendal_43d_clear
- https://polyhaven.com/a/forest_slope
- https://polyhaven.com/a/golden_gate_hills
- https://polyhaven.com/a/studio_small_09

On each page choose **HDRI · 2K · .hdr**. (4K is overkill for web, 1K is too soft.)

Drop the files into `~/Desktop/Kingdom-Digital-Services/Websites/awakening-adventures/public/hdri/`.

## Once they're in place

`npm run dev` — Scene 1 should immediately read more cinematic. The Stargazer's plexiglass will start picking up real-world reflections, the wood frame will get accurate ambient color, and the interior amber light will read against a real sky tone rather than the flat black backdrop.

## File sizes

Each 2K HDRI is roughly 6–12 MB. They will commit to git if you drop them straight in — that's fine for now while we're shipping. Phase 5 moves the larger ones to Cloudflare R2 + the `NEXT_PUBLIC_ASSET_CDN` env var.
