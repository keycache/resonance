# Phase 4.2 Manual Capture Checklist

Use this checklist to complete the remaining manual demo assets that cannot be generated automatically.

## 1) Capture real Stage outputs

1. Run with normal inference mode (not DEMO_MODE).
2. Input water cycle lesson at Grade 5 level.
3. Select coastal fishing + Tagalog community cues.
4. Run pipeline and copy Stage 1/2/3 outputs.
5. Save to `public/demo/output-coastal-tagalog.json`.

Repeat for rural farming + Bengali and save to:
- `public/demo/output-rural-bengali.json`

## 2) Capture worksheet photo

1. Print or display the water cycle worksheet.
2. Photograph it using phone camera.
3. Save image as:
- `public/demo/worksheet-water-cycle-grade5.jpg`

## 3) Capture demo screenshots

Take screenshots at each stage and save under `public/demo/screenshots/`:
- `01-input.png`
- `02-stage1.png`
- `03-stage2-diff.png`
- `04-stage3-cards.png`
- `05-install-prompt.png`

## 4) Final verification

1. Verify all files exist under `public/demo`.
2. Re-run with `PUBLIC_DEMO_MODE=true` and confirm demo loads these assets.
