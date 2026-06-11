# CLAUDE.md — OpenOverlay (stream_overlay)

Project context for Claude Code. Read this fully before any task.

## What this project is

**OpenOverlay** — a free, open-source stream overlay builder for the Config Makeathon 2026.
Users design an overlay on a canvas (editor app built in Figma Make), then export it as
(a) a downloadable ZIP of plain HTML/CSS/JS they own forever, or (b) a hosted browser-source
URL — either pastes straight into OBS.

**HARD DEADLINE: June 18, 11:59 PM PST (June 19 ~12:29 PM IST). Internal freeze: June 17 night.**
When in doubt, choose the faster, simpler option. Working and ugly beats elegant and late.

## The core architectural idea (never violate this)

The SAME widget code is used in two places:
1. As live previews inside the Figma Make editor app
2. As the exported overlay that runs in OBS

Therefore every widget MUST be a **vanilla Web Component** with **zero build step** and
**zero framework dependencies**. If a solution requires React, a bundler, or npm packages
inside `/widgets`, it is the wrong solution.

## Repo structure

```
/widgets
  tokens.css          # mirrors Figma variables 1:1 — single source of truth for theming
  webcam-frame.js     # <oo-webcam>
  alert-box.js        # <oo-alert>
  chat-overlay.js     # <oo-chat>
  goal-bar.js         # <oo-goal>
  label.js            # <oo-label>
  chat-source.js      # anonymous Twitch IRC feed
  alert-source.js     # simulate() event bus
  test.html           # renders all widgets for visual QA / OBS testing
/export-engine
  overlay-template.html  # the exported overlay shell
  zip-builder.js         # client-side JSZip packaging
/app                  # Figma Make editor export lives here (if/when exported)
/design               # PNG exports from Figma
/docs
  workflow.md         # build-in-public process writeup
  obs-setup.md        # end-user OBS guide
/footage              # gitignored — screen recordings
```

## Coding rules

- **Widgets:** vanilla JS custom elements, ES modules, Shadow DOM optional but if used,
  CSS custom properties must pierce it (use `:host` + inherited vars).
- **Element naming:** `oo-` prefix. Variants are HTML attributes:
  `<oo-alert type="follow|sub|donation|raid">`, `<oo-webcam shape="wide|standard|circle" nametag>`.
- **Theming:** ALL colors, fonts, radii, spacing, glows come from CSS custom properties
  defined in `tokens.css`. Token names mirror Figma variable names exactly:
  `--oo-accent`, `--oo-accent-2`, `--oo-bg`, `--oo-bg-glass`, `--oo-text`, `--oo-text-dim`,
  `--oo-border`, `--oo-glow`, `--oo-font-display`, `--oo-font-body`.
  Themes switch via `[data-theme="neon|minimal|retro"]` on `<html>` or the overlay root.
  Never hardcode a color in a widget. Ever.
- **Animations:** CSS/SVG/canvas only — no video files, no Lottie deps. Enter/exit hooks:
  add `.oo-enter` / `.oo-exit` classes; widgets animate themselves. Alert burst effects are
  layered CSS/SVG inside the component so they retheme with tokens.
- **OBS constraints (the export target):** OBS browser source = Chromium (CEF).
  `body { background: transparent; margin: 0; }`. Design for 1920×1080. Web fonts via
  Google Fonts `<link>` in the export template (OBS has network access). No localStorage
  reliance. Must run from `file://` (ZIP path) AND `https://` (hosted path) — so no
  CORS-dependent fetches except the Twitch websocket.
- **Dependencies:** none in `/widgets`. JSZip (vendored or CDN) allowed only in
  `/export-engine`. Supabase JS allowed only in the app/hosted-renderer layer.
- **Style:** modern ES2022+, no TypeScript (no build step), JSDoc comments on public APIs.

## Figma MCP workflow (Phase 2 tasks)

When asked to generate a widget from Figma:
1. Read the component (ALL variants) from the "OpenOverlay — Design System & Editor" file via the Figma MCP server.
2. Map every Figma variable to its `--oo-*` token. If a value in the design isn't bound to a variable, flag it — don't silently hardcode.
3. Generate the Web Component honoring exact spacing, radii, type sizes from the design.
4. Output a snippet for `test.html` so it can be visually diffed against Figma.
5. Pixel-faithfulness beats cleverness. Match the design.

First MCP task is always `tokens.css`: read the variable collections (all 3 modes) and emit
`:root`/`[data-theme]` blocks.

## Live data layer

- **Chat:** anonymous Twitch IRC. `wss://irc-ws.chat.twitch.tv:443`, NICK `justinfan` + random
  digits (no auth, read-only), `CAP REQ :twitch.tv/tags`, `JOIN #<channel>`. Parse PRIVMSG
  tags for `display-name` and `color`. Reconnect with backoff. Channel comes from a
  `?channel=` query param on the overlay URL.
- **Alerts/goals:** `alert-source.js` exposes `simulate(type, payload)` and a tiny pub/sub.
  Real platform integrations are OUT OF SCOPE before the deadline. Test-fire buttons in
  `test.html` and in the editor's preview mode.
- **Uptime label:** local clock from `?start=` timestamp or page load.

## Export engine (Phase 4)

Input: overlay JSON `{ name, theme, widgets: [{ type, x, y, w, h, props }] }`.
- **ZIP path:** fill `overlay-template.html` (absolute-positioned widgets from JSON),
  bundle widgets + tokens.css + sources + `README-OBS.txt` with JSZip, all client-side.
- **Hosted path:** JSON stored in Supabase table `overlays(id, name, json, theme, created_at)`;
  route `/o/{id}` renders the same template. If time runs short, ZIP path wins — cut hosted.

## Git conventions (this doubles as build-in-public evidence)

- Commit early, commit per widget/feature. Messages like:
  `widgets: <oo-alert> generated from Figma via MCP — pixel-matched all 4 variants`
- Never commit `/footage`, Supabase keys, or `.env`. Keys go in `.env` + `.gitignore`.
- Push at the end of every session.

## Session status (last updated June 11, 2026)

Phase 0 nearly done (June 11, 2026 session).

Done:
- [x] Scaffold: LICENSE (MIT, Priyanshu Chaudhary), README.md, .gitignore
- [x] Git: repo on `main`, pushed to https://github.com/Powerkiller69/stream_overlay (public).
      Local identity: Priyanshu Chaudhary / navindrakumar@gmail.com
- [x] Tooling: `gh` CLI (authed as Powerkiller69), `supabase` CLI (logged in + linked) — both via brew
- [x] Supabase: project `stream_overlay`, ref `nehypxfsiqspsosodadw`, Mumbai, org Pixel Edits.
      `overlays(id, name, json, theme, created_at)` via migration
      `supabase/migrations/20260611000000_create_overlays.sql`, RLS public select+insert
      (no-auth export flow, intentional). REST insert/read round-trip verified.
      Dashboard: https://supabase.com/dashboard/project/nehypxfsiqspsosodadw
- [x] Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_DB_PASSWORD` in `.env` (gitignored)
- [x] Accounts (human): Figma Pro upgraded via Contra link, Contra setup + deadline confirmed (June 11)
- [x] **Weave ELIMINATED from plan** (June 11 decision): no Weave account/assets — all animation
      is CSS/SVG written as code. plan.md updated to match. No stinger WebM; alert burst +
      enter/exit animations are token-themed CSS inside the components.

- [x] Figma MCP: official Figma MCP server connected + authed in Claude Code (June 11).
      Round-trip verified by reading the design file. **Phase 0 COMPLETE.**
      File: "OpenOverlay — Design System & Editor", fileKey `DGHpvud2X4NNe7Uz7nX2KN`,
      https://www.figma.com/design/DGHpvud2X4NNe7Uz7nX2KN/
      File is currently blank (Phase 1 starts now).
      MCP authed as priyanshuchaudhary2017@gmail.com, **Full seat** on pro team
      "Priyanshu Chaudhary's team" (upgraded from View, verified June 11). Phase 3/Make unblocked.

Phase 1 progress (June 11):
- [x] Hygiene: Obsidian installed, vault at `stream_overlay/` in repo (makeathon-log.md,
      project-info.md). OBS scene collection `openoverlay-demo` created with browser source
      pre-pointed at `widgets/test.html` (blank until Phase 2).
- [x] **Tokens DONE in Figma via JSON import**: collection `tokens`, 13 variables
      (8 colors + font-display/font-body + size-s/m/l), 3 modes Neon/Minimal/Retro.
      Source JSONs in `design/tokens/*.tokens.json` (Figma color-object format —
      plain hex strings get rejected, only 5/13 imported until fixed).
- [x] **Core 5 widgets BUILT IN FIGMA VIA MCP `use_figma`** (June 11): webcam-frame (6 variants),
      alert-box (4), chat-overlay (2), goal-bar (2), stream-label (2) on 🧩 Overlay Widgets page.
      All fills/strokes/text bound to token variables; fontFamily/fontSize bound too (mode switch
      swaps Orbitron→Inter→VT323). Glow = drop shadow bound to `glow` var (no separate effect
      styles needed so far). Page pinned to Neon mode; token swatch sheet on 🎨 Tokens page.
      `use_figma` notes: scripts need `return` for output; errors roll back the whole call;
      load ALL mode fonts before switching variable modes.
- [ ] Human review pass in Figma: tweak spacing/colors to taste, record mode-flip footage
- [ ] Before Phase 3 (Make): move file out of Drafts into team project + publish library

**Next up:** human design review + 1920×1080 stage frames per theme (templates), then Phase 2
MCP codegen June 13 (tokens.css first).

Keep this section updated every session: mark work done here + tick phase tracker below
as phases complete.

## Phase tracker (update the checkboxes as you complete work)

- [x] Phase 0: repo, Supabase, MCP round-trip verified (June 11)
- [ ] Phase 1: Figma design system (human task — Figma side)
- [ ] Phase 2: tokens.css + 5 widgets via MCP + chat/alert sources + test.html verified in OBS
- [ ] Phase 3: Figma Make editor (human drives Make; Claude Code assists with template JSONs & glue)
- [ ] Phase 4: export engine, both paths tested in OBS
- [ ] Phase 5: animations-as-code polish, deploy, docs/workflow.md, README final
- [ ] FREEZE June 17 night — after freeze, only docs and bugfixes that block the demo

## What NOT to do

- Don't add frameworks, bundlers, or TypeScript to `/widgets`.
- Don't refactor Figma Make's generated app code wholesale — patch minimally.
- Don't implement OAuth/StreamElements/YouTube APIs — simulate mode only.
- Don't hardcode theme values, channel names, or Supabase keys.
- Don't gold-plate. Every hour matters. Ask: "does this make the June 18 demo better?"
  If no, skip it.

## The demo that everything serves

June 17 night: design an overlay in the editor → Export → paste into OBS → go live on
Pixel Pataka (Valorant) with real Twitch chat flowing through `<oo-chat>` → switch themes
live. Every technical decision should make THAT moment work flawlessly.
