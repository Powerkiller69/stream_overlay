# OpenOverlay — Makeathon Log

One entry per session: 2–3 lines + 1 screenshot. This becomes the video script and the build-in-public thread.

## June 11 — Day 1 (setup)

- Repo `stream_overlay` live on GitHub (MIT, README). Supabase project + `overlays` table migrated and verified.
- Figma Pro via Contra confirmed. Figma MCP connected to Claude Code, round-trip verified against the design file. Seat upgraded View → Full.
- Decision: Weave cut — all animations ship as token-themed CSS/SVG code instead of video assets.
- Screenshot: _(add)_

## June 11 — Day 1 (design system: tokens)

- Tokens done the workflow-story way: Claude Code wrote the variable JSONs (Neon/Minimal/Retro), imported straight into Figma — 13 variables × 3 modes, zero manual entry. First attempt taught us Figma's import wants color-object format, not hex strings (5/13 → fixed → all in).
- OBS scene collection `openoverlay-demo` prebuilt with a browser source already pointed at the future test.html.
- Next: core 5 widget components bound to the tokens.
- Screenshot: _(add — variables panel with 3 modes)_

## June 11 — Day 1 (widgets, built BY the agent)

- All 5 core widgets (16 variants total) built directly on the Figma canvas by Claude Code via the MCP `use_figma` tool — auto-layout components, every color/font/size bound to token variables. Mode flip rethemes everything including fonts.
- This is the workflow story inverted: not just design→code, but code→design on the same token system.
- Human pass next: spacing/taste tweaks + record the mode-flip.
- Screenshot: _(add — widgets page in Neon)_

## June 11 — Day 1 (editor UI + templates + polish, all agent-built)

- Editor UI (4 screens), 3 assembled 1920×1080 template stages, and the Community cover — all generated on the canvas via MCP. Canvas previews are real component instances; templates retheme per-frame via variable modes.
- Polish pass after "looks average" feedback: alert strips + icon badges, webcam double-frames, chat accent edge bars, goal knobs, full customization panel (style sliders, theme swatches, font pickers, custom theme).
- Phase 1 done 2 days ahead of schedule. PNGs in /design.
- Screenshot: _(add — neon template stage)_
