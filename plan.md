# OpenOverlay — Config Makeathon Master Plan (v2 — HARD DEADLINE REVISED)

**The pitch:** A free, open-source stream overlay *builder* — not a template shop. Design your overlay on a canvas, get a browser-source URL for OBS, and download the HTML/CSS/JS so you own it forever. The anti-OWN3D.

**The workflow story (what judges score):** Figma Design (component library) → Figma MCP + Claude Code (pixel-faithful widget code) → Figma Make (the editor app) → live on stream the same day. Animations are pure CSS/SVG, shipped as code.

## ⏰ DEADLINE — READ THIS FIRST
- Submissions close **June 18, 11:59 PM PST** = **June 19, ~12:29 PM IST** (Delhi).
- **Your internal deadline: submit by June 18, 11:00 PM IST** — never trust a deadline-hour upload with video links and social posts in the mix.
- Today is June 10. That's **8 working days**. This plan is compressed accordingly.
- Verify the deadline on your Contra dashboard TODAY in case it shifts.

**Credit budget:**
- Figma Pro: 10,000 AI credits → ~70% for Make iterations, ~20% in-Figma AI assists, ~10% reserve
- Claude Code: your existing setup, unmetered by the makeathon — push ALL heavy lifting here.
- (Weave: CUT from plan — all animation is CSS/SVG via Claude Code instead.)

## 📅 Compressed schedule at a glance (IST)

| Date | Focus | Must be true by midnight |
|---|---|---|
| **Jun 10 (today)** | Phase 0 setup + start tokens | MCP round-trips, repo live, tokens started |
| **Jun 11** | Design system: tokens + core widgets | Tokens + 5 core widgets done in Figma |
| **Jun 12** | Finish widgets + editor UI design | Figma file ~90% done, PNGs committed |
| **Jun 13** | MCP codegen: all widgets as code + live chat | `test.html` works in OBS with real Twitch chat |
| **Jun 14** | Figma Make: editor v1 | Canvas + palette + properties panel functional |
| **Jun 15** | Make iteration + Supabase save/load + templates | Editor feature-complete |
| **Jun 16** | Export engine (AM) + CSS animation polish (PM) | Both export paths work in OBS; alert burst + enter/exit animations done |
| **Jun 17** | Deploy, README, Community publish, full QA | Product DONE and frozen. Shoot demo footage tonight |
| **Jun 18** | Video edit, social post, SUBMIT | Submitted by 11 PM IST with all links |

Golden rule: **the product freezes June 17 night.** June 18 is media-only. A worse app with a great video beats a perfect app submitted late.

---

## Phase 0 — Setup (June 10, ~2 hours, do before anything else)

### 0.1 Accounts & access
- [x] Contra confirmation email → click the access code link → upgrade Starter team to **Figma Professional**; verify 10k credits *(done June 11)*
- [x] Re-confirm deadline + submission form fields on Contra (live link, file link, video, social links) *(done June 11)*
- Weave: **ELIMINATED from plan** — no Weave account, no Weave assets. All animation is CSS/SVG written by Claude Code.
- Credits missing? Contra/link issues → hello@contra.com. Check spam/promotions tab first.

### 0.2 Repo & project hygiene
- [ ] GitHub repo: `openoverlay` (decide the name NOW — it goes in every asset). MIT LICENSE, README with one-paragraph pitch + "built for Config Makeathon 2026"
- [ ] First commit today. Commit history IS your Build-in-Public evidence.
- [ ] Obsidian note `makeathon-log.md` — 2–3 lines + 1 screenshot per session. This becomes the video script and social thread for free.

### 0.3 Tooling
- [ ] Add **Figma Dev Mode MCP server** to Claude Code; test by reading any frame from any file. Don't proceed until it round-trips.
- [ ] Create **Supabase** project (free tier); note URL + anon key
- [ ] OBS scene collection `openoverlay-demo`
- [ ] Loom (or OBS) ready for screen recordings

### 0.4 Recording discipline
- [ ] Start a recording at the start of EVERY session. `footage/day1/`, `footage/day2/`... Raw footage is cheap; re-creating "Make generates the editor" is impossible.

### 0.5 Tonight: start Phase 1 tokens (see 1.2)

---

## Phase 1 — Figma Design System (June 10 night – June 12)

Goal: one Figma file that is BOTH the codegen source AND the Community-publishable asset (+5 points).

### 1.1 File structure (30 min)
File: **"OpenOverlay — Design System & Editor"**, pages:
1. `🎨 Tokens` 2. `🧩 Overlay Widgets` 3. `🖥️ Editor UI` 4. `📦 Templates` 5. `📣 Cover & Community`

### 1.2 Tokens (June 10 night, 2–3 hrs) — the most important step
- [ ] Figma **variables**: `accent`, `accent-2`, `bg`, `bg-glass`, `text`, `text-dim`, `border`, `glow`
- [ ] Typography variables: `font-display`, `font-body`, sizes S/M/L
- [ ] Effects: one glow, one glass-blur, one hard-shadow style
- [ ] **3 modes**: `Neon` (Valorant-ish purple/cyan), `Minimal`, `Retro`. Mode switch = instant retheme — record yourself flipping modes (demo money-shot).

### 1.3 Overlay widget components (June 11, full day)
Auto-layout components, variants, ALL colors/fonts bound to variables, clean layer names (`alert/title`) — MCP codegen quality depends on naming.

**Core 5 (mandatory):**
| Widget | Variants |
|---|---|
| Webcam frame | 16:9, 4:3, circle / ± name tag |
| Alert box | follow, sub, donation, raid |
| Chat overlay | compact, bubble |
| Goal bar | follower, donation |
| Stream label | uptime, socials |

**Stretch (only if June 11 goes well):** now playing, event ticker, Starting Soon / BRB / Ending scene cards.
- [ ] One **1920×1080 assembled stage frame** per theme mode → your 3 templates AND marketing shots

### 1.4 Editor UI design (June 12, half day — 4 screens max, Make fills gaps)
- [ ] Main editor: left widget palette / center 16:9 canvas / right properties panel / top bar (name, theme switcher, Save, **Export**)
- [ ] Export modal: tab "Browser Source URL" + tab "Download ZIP"
- [ ] Gallery/home: saved overlays grid + 3 template cards
- [ ] Theme picker
- Dark UI, Pixel Edits editorial aesthetic — it should look like a product.

**Checkpoint June 12 night:** Figma file ~90% done; export PNGs to repo `/design`.

---

## Phase 2 — MCP Codegen: Widgets as Code (June 13, full day)

Goal: every widget is a standalone, token-driven **vanilla Web Component** (runs in OBS browser source with zero build step; Make can still consume them). This is your novel-workflow centerpiece.

Repo:
```
/widgets
  tokens.css          ← mirrors Figma variables 1:1 (all 3 modes as [data-theme="..."])
  webcam-frame.js  alert-box.js  chat-overlay.js  goal-bar.js  label.js
/export-engine
/docs
```

### 2.1 The MCP loop (repeat per widget, ~45–60 min each)
1. [ ] Claude Code prompt: *"Read the `alert-box` component (all variants) from my OpenOverlay Figma file via MCP. Generate a vanilla Web Component `<oo-alert>` in /widgets/alert-box.js. All colors/fonts/radii/spacing from CSS custom properties matching the Figma variable names in tokens.css. Variants as attributes (type='follow|sub|donation|raid'). Enter/exit animation hooks (.oo-enter/.oo-exit). No frameworks, no build step."*
2. [ ] Render in bare `test.html`, screenshot vs Figma, iterate to pixel-faithful. **Record one full compare-iterate loop** (Innovative Workflow footage).
3. [ ] Commit per widget.
- [ ] FIRST: generate `tokens.css` from the Figma variable collections via MCP.
- [ ] Order: tokens → webcam-frame → alert-box → chat-overlay → goal-bar → label. Stretch widgets ONLY if ahead of schedule.

### 2.2 Live-data wiring (same day, Claude Code, zero credits)
- [ ] **Chat (killer demo):** anonymous Twitch IRC — `wss://irc-ws.chat.twitch.tv:443`, nick `justinfan12345` (no auth), `JOIN #channel`, parse PRIVMSG tags for username/color → feeds `<oo-chat>`. Test on a busy live channel.
- [ ] **Alerts:** `alert-source.js` with `simulate(type)` test-fire button. StreamElements socket = CUT by default (re-add only if you finish everything early).
- [ ] Goal bar on the same simulate bus; uptime label = local clock.

**Checkpoint June 13 night:** `test.html` as OBS browser source over Valorant footage — everything renders, chat is live. Screenshot → README. Commit.

---

## Phase 3 — Figma Make: The Editor App (June 14–15)

Budget ~6,000–7,000 credits. Few large detailed prompts > many small ones.

### 3.1 Before spending a credit (June 14 AM)
- [ ] **Bring Figma library styles into Make** as context
- [ ] Write the master prompt in Obsidian first, edit cold, then paste:

> "Build a stream overlay editor web app. Layout per my Figma design: left sidebar widget palette (webcam frame, alert box, chat overlay, goal bar, stream label); center 1920×1080 canvas at responsive scale with snap-to-grid drag + resize handles; right properties panel (position/size plus widget-specific props); top bar with project name, theme switcher (Neon/Minimal/Retro), Save, Export.
> State model: overlay = JSON { name, theme, widgets: [{type, x, y, w, h, props}] }.
> Canvas renders live widget previews per my design specs.
> Export opens a modal with tabs 'Browser Source URL' and 'Download ZIP' (stub actions, fire `onExport(json)`).
> Persist to Supabase (table overlays: id, name, json, theme, created_at) with save/load and a home gallery of saved overlays + 3 built-in templates."

### 3.2 Iteration loop (June 14 PM – June 15)
Fix in priority order, batched feedback per prompt:
1. Drag/resize/snap feel → 2. properties ↔ canvas two-way binding → 3. theme switching re-skins all widgets → 4. Supabase save/load → 5. template gallery (hand-write the 3 template JSONs from your stage frames)
- [ ] Use Make's **direct code editing** for small fixes (free) instead of prompts (credits)
- [ ] Record first generation + at least one prompt→change moment

**Checkpoint June 15 night:** editor feature-complete. Anything not working gets cut, not extended.

---

## Phase 4 — Export Engine + Animation Polish (June 16)

### 4.1 AM — Export engine (Claude Code, free). THE differentiator.
- [ ] **ZIP path:** template `overlay.html` imports `/widgets/*.js` + `tokens.css`, absolutely positions widgets from JSON, includes `chat-source.js`/`alert-source.js`, plus `README-OBS.txt`. Bundle client-side with JSZip. No server.
- [ ] **Hosted URL path:** JSON in Supabase → `https://yourapp/o/{id}` renders the same overlay.html. URL pastes straight into OBS.
- [ ] Test BOTH in OBS over gameplay. Fix: transparent body, Google Fonts links in export, 1920×1080 scaling.
- **Behind schedule? Cut the hosted path, keep ZIP-only** — "local-first, truly yours" is still the story.

### 4.2 PM — Animation polish (Claude Code, CSS/SVG only, free, ~3 hrs)
- [ ] **Alert burst** behind `<oo-alert>` on fire — layered CSS/SVG inside the component, rethemes with tokens
- [ ] Enter/exit animations (`.oo-enter` / `.oo-exit`) tuned per widget, per theme feel
- [ ] Animated Starting-Soon background (pure CSS gradient/particle loop) — only if time remains
- [ ] Record the before/after polish pass (workflow footage)

---

## Phase 5 — Deploy, Polish, Freeze (June 17)

- [ ] Deploy: Make hosting, or export → Vercel/DigitalOcean (student credits). Don't burn hours on custom DNS.
- [ ] README final: hero GIF, "Why" (paywall problem), architecture diagram (Figma → MCP → Make → code), local-run + OBS guide, MIT badge
- [ ] `docs/workflow.md` — full process writeup from the Obsidian log → directly targets **Build-in-Public $10k**
- [ ] Publish Figma file to **Figma Community** with proper cover (+5 pts)
- [ ] QA: fresh browser → blank overlay → template overlay → both exports → OBS test
- [ ] Tag v0.1 release. **PRODUCT FREEZES TONIGHT.**
- [ ] Night: shoot the payoff footage — design an overlay live, export, paste into OBS, go live on Pixel Pataka with real chat, switch themes on stream.

---

## Phase 6 — Media Day & SUBMIT (June 18 — nothing else happens today)

### 6.1 Main walkthrough video (2–3 min, edit by afternoon)
1. **Hook (0:00–0:15):** OWN3D pricing page. "Streamers pay for overlays they don't even own. I'm a streamer. I fixed it."
2. **Problem (0:15–0:35):** template downloads vs. real design tool; ownership; open source
3. **Workflow montage (0:35–1:40):** Figma tokens/components → MCP pixel-match loop → Make generating the editor → animations-as-code polish. Narrate decisions, not clicks.
4. **Payoff (1:40–2:30):** the June 17 live-stream footage. 5. **Close:** repo + community file — "fork it, it's yours."

### 6.2 30-second social cut (required to qualify)
- [ ] Hook + montage + payoff. Vertical AND horizontal.
- [ ] Post to X / LinkedIn / Instagram with **#ConfigMakeathon @figma**, tag Figma Make, 1–2 sentences
- [ ] Bonus: 5–6 post build-in-public thread from your daily screenshots

### 6.3 Submit on Contra — **by 11:00 PM IST June 18** (deadline is June 19 ~12:29 PM IST, but don't gamble)
- [ ] Live app link ▢ GitHub repo ▢ Figma Community file ▢ Video ▢ Social links (prompted post-submit) ▢ Teammate tag if any (max 2; only submitter is paid)
- [ ] After submitting, confirm the social-links prompt is completed — it's required for the prize pool.

---

## Scoring map
| Criterion | Your answer |
|---|---|
| Quality (design/build/craft) | Token-driven design system, working editor, real OBS output |
| Real problem | Paywalled overlay tools; you ARE the user; open-source ownership |
| Video | Scripted, footage captured throughout, live-stream payoff |
| Novel workflow | Same Figma components → MCP → editor preview AND exported code; Make+MCP both meaningful; animations ship as themable code, not video files |
| Social (+5) / Community file (+5) | Both done |

## Cut list (apply in order the moment you slip a day)
1. StreamElements integration (already default-cut → simulate-only)
2. Stretch widgets (ticker, now-playing, scene cards)
3. Hosted-URL export → ZIP-only
4. Animation polish extras (Starting-Soon loop etc.) — keep basic enter/exit only
5. Template count 3 → 1
6. **NEVER cut:** video, social post, OBS live demo, repo, Community publish

## Daily rhythm
Start session → start recording → check today's row in the schedule → work → 3-line Obsidian log + 1 screenshot → commit → stop recording.
