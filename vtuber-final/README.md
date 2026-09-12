# VTuber Rant – Remotion Project (Mars Moon / Cartoon Galaxy)

60-second humorous excerpt from “A New YouTube Policy May Destroy Animation for Good!”  
Vox-style paper-collage talking head with floating cutouts that swap emotional expressions in time with the dialogue, lightly animated starfield, and short cinematic B-roll inserts.

## Quick start (on your VPS)

```bash
cd vtuber-rant
npm install
npx remotion studio          # preview
npx remotion render VTuberRant out/rant.mp4
```

## Assets

- `public/audio/clip.mp3` – ~62 s humorous segment (watch-hours doubling + AI competition + “weed out animation” rant)
- `public/chars/*.png` – expression cutouts (happiness, sadness, curiosity, triumph, fatigue, sneaky, greeting, shock, confident, shyness, thought, annoy, idle)
- `public/broll/` – short Pixabay clips (drawing, YouTube, AI network, typing)

## Timeline notes

Expression swaps are driven by a simple second-based timeline inside `VTuberRant.tsx`.  
B-roll windows: ~12-18 s (drawing), 28-34 s (YouTube), 42-48 s (AI).  
Character floats with gentle sine-based position + rotation for a lively paper-cutout feel.

Render settings default to 1280×720 @ 30 fps, 1860 frames.
