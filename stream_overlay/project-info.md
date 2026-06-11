# OpenOverlay — Project Info

Everything-in-one-place reference. Detailed plan: `plan.md` in repo root. Session log: [[makeathon-log]].

## What it is

Free, open-source stream overlay **builder** for Config Makeathon 2026. Design on a canvas (Figma Make editor), export as ZIP of plain HTML/CSS/JS or hosted browser-source URL — both paste straight into OBS. The anti-OWN3D.

## Deadlines

- **Submission: June 18, 11:59 PM PST** (June 19 ~12:29 PM IST)
- Internal: submit by **June 18, 11 PM IST**
- **Product freeze: June 17 night** — June 18 is media-only

## Links & accounts

- GitHub repo: https://github.com/Powerkiller69/stream_overlay (public, MIT) — gh CLI authed as Powerkiller69
- Figma file: "OpenOverlay — Design System & Editor" — https://www.figma.com/design/DGHpvud2X4NNe7Uz7nX2KN/
- Figma account: priyanshuchaudhary2017@gmail.com ("Pixel Edits"), **Full seat**, Pro team "Priyanshu Chaudhary's team" (10k AI credits via Contra)
- Supabase: project `stream_overlay`, ref `nehypxfsiqspsosodadw`, Mumbai — dashboard: https://supabase.com/dashboard/project/nehypxfsiqspsosodadw — keys in `.env` (gitignored, never in vault/repo)
- Submission: Contra dashboard (live link + repo + Figma Community file + video + social links)

## Key decisions

- **Weave CUT** (June 11): all animation = CSS/SVG written as code, token-themed, no video assets
- Widgets = vanilla Web Components (`oo-` prefix), zero build step, zero frameworks — same code runs in editor preview AND exported OBS overlay
- Theming via CSS custom properties (`--oo-*`) mirroring Figma variables; 3 modes: Neon / Minimal / Retro
- Chat = anonymous Twitch IRC (justinfan, read-only); alerts = simulate-only, no platform OAuth
- If time runs short: cut hosted-URL export, keep ZIP ("local-first, truly yours")

## Phase status (as of June 11)

- [x] Phase 0: repo, Supabase, Figma MCP round-trip — **DONE June 11**
- [ ] Phase 1: Figma design system (tokens 3 modes + core 5 widgets) — **IN PROGRESS, today's work**
- [ ] Phase 2 (Jun 13): MCP codegen — tokens.css + 5 widgets + live chat, test.html in OBS
- [ ] Phase 3 (Jun 14–15): Figma Make editor app
- [ ] Phase 4 (Jun 16): export engine (ZIP + hosted) + animation polish
- [ ] Phase 5 (Jun 17): deploy, docs, Figma Community publish, QA, FREEZE
- [ ] Phase 6 (Jun 18): video, social post (#ConfigMakeathon @figma), SUBMIT

## Core 5 widgets

| Widget | Element | Variants |
|---|---|---|
| Webcam frame | `<oo-webcam>` | 16:9, 4:3, circle / ± name tag |
| Alert box | `<oo-alert>` | follow, sub, donation, raid |
| Chat overlay | `<oo-chat>` | compact, bubble |
| Goal bar | `<oo-goal>` | follower, donation |
| Stream label | `<oo-label>` | uptime, socials |

## Daily rhythm

Start session → start recording → check schedule row → work → log entry here (2–3 lines + screenshot) → commit → stop recording.

## Demo (everything serves this)

June 17 night: design overlay in editor → Export → paste into OBS → live on Pixel Pataka (Valorant) with real Twitch chat in `<oo-chat>` → switch themes live.
