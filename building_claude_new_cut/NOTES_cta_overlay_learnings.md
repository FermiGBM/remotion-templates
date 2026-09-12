# CTA / B-roll Overlay — Lessons Learned

Captured from the "Claude One" 4-min cut CTA overlay build (WriterScout-4MinCut).
Use these when building **any future overlay/motion-graphic asset** composited over a
Remotion-rendered video.

## The CRITICAL lesson: white-on-white background assets cannot be ML-segmented

The CTA (girl in white sailor uniform + white "SUBSCRIBE!" sign) had a **pure white
background**. Every naive removal method FAILED because her white uniform and white sign
are the SAME color as the background:

| Method | Result |
|--------|--------|
| ffmpeg `colorkey=0xFFFFFF` | Erases white parts of the character (eroded semi-transparent pixels) |
| U²-Net (`rembg` u2net) | **Drops the white sign entirely** + erases whites (vision confirmed: arms empty) |
| isnet-general-use (`rembg` isnet) | Keeps sign, but assigns mid-alpha (51-200) to shaded-white body → **glassy/translucent sign**, flicker |
| "alpha boost" (force light pixels to alpha 255) | Doesn't help: pixels were **already deleted** at generation time — you can't opacity-boost pixels that don't exist |

**Moral:** you cannot salvage foreground whites from a white-on-white source using
color-keying OR ML segmentation. The white foreground is fundamentally indistinguishable
from white background to a full-image segmenter.

## THE WORKING SOLUTION: border-flood mask + real video pixels

The only approach that preserves bright whites AND separates background:

1. **Border-flood (deterministic, geometric — NOT ML):**
   - Luminance threshold (`lum > 200`) → bool white mask
   - Flood-fill from all 4 frame borders through white → these are the **background**
   - Everything else (`~bg`) = the character, including her **enclosed white** (uniform + sign)
   - Verified at frame 150: 97,970 border-connected (bg) vs 23,324 interior-enclosed (character)

2. **Composite the ORIGINAL video's real RGB pixels** inside the mask (NOT a per-frame
   recomputed cutout/RGBA). This is what fixes the glassy sign: the real, bright, crisp
   source pixels (lum ~210) show at full opacity with readable letters.

3. **Temporal smoothing (fixes flicker):**
   - `MinFilter(3)` erode + `MaxFilter(3)` dilate (removes 1px border halo)
   - **5-frame temporal median** on the alpha mask (`np.median(buf[i-2:i+3])`)
   - Optional `GaussianBlur(1.0)` feather on the final alpha
   - Result: opaque% variation ≤ ±0.7% across frames (was wildly unstable with ML)

## Key measurable before/after (frame 150)

| Metric | isnet cutout | border-flood + real pixels |
|--------|-------------|----------------------------|
| Opaque % of frame | 27% | 37% |
| Mean luminance of opaque region | 109 | 152 |
| % of opaque that is white (>200) | 10.2% | 39.9% |
| Composite region meanLum | ~55 | ~81 |
| Composite region highWhite% | ~1% | ~10.7% |
| Temporal opacity stability | large jumps | ±0.7% |

## Remotion <Img> limitation (important)

- **Remotion's `<Img>` renders a white placeholder box for RGBA PNGs** — do NOT composite
  transparent PNGs via `<Img>`. Proven: pre-CTA frame 3855 = 0% white, CTA frame 4000 =
  55.8% white; even black-RGB transparent PNGs still show white. Not a cache issue.

## Video/alpha codec notes

- **VP9/VP8 alpha WebM is NOT available** in this ffmpeg build (`libvpx`, `libvpx-vp9`,
  `libsvtav1`, `vp8_v4l2m2m` — none support alpha).
- **PNG-codec-in-MOV (RGBA)** is NOT readable by Chromium/Remotion
  ("FFmpegDemuxer: no supported streams").
- The **reliable compositing path is ffmpeg `overlay` filter** (not Remotion-internal):
  - Input: PNG sequence with real alpha (`format=rgba`)
  - `overlay=x=40:y=517:eof_action=pass:shortest=0` composites cleanly (verified 0% white box)
  - Shift start time with `setpts=PTS-STARTPTS+<SECONDS>/TB` so the overlay frame 0 lands
    at the correct spot in the base video
  - Fade in with `fade=t=in:st=<SEC>:d=<DUR>`
  - `-pix_fmt yuv420p` on output
- `mix-blend-mode: screen` does NOT key out (keeps white over dark bg) — rejected.

## Remotion render practicalities

- `npx remotion render <compId> out.mp4 --concurrency 4 --x264-preset veryfast`
- Full 4-min render takes **~42 min**; run detached: `setsid bash -c '...' </dev/null >/dev/null 2>&1 & disown`
- For placement check, render only the relevant window:
  `--frames=<start>-<end>` (fast, e.g. 3840-4160)
- Global overlay offset: comp frame 3870 = video t=129s = 3870/30. CTA lasted 240 frames (8s).

## Background removal tooling (environment)

- Python venv: `/home/tmpro2025/.venv-sv2` (has numpy, torch, PIL; NO scipy/cv2/rembg by default)
- Install segmentation: `pip install onnxruntime rembg` (works; model weights download on first run)
- Available rembg models: `u2net`, `isnet-general-use` (isnet better at held objects)
- Vision verification: `~/.local/bin/simplevision2 <image> "<prompt>"`
  - NOTE: pixel-level checks are MORE reliable than vision (vision missed a white box once).
- `storageto upload <file>` → gives temp URL (expires ~3 days)

## Verified final values
- CTA overlay position: lower-left `x=40 y=517`, fade-in `0.667s`
- Final confirmed-good clip: `out/cta_placement_check5.mp4`
