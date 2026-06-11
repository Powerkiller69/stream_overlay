# OpenOverlay

A free, open-source stream overlay builder. Design your overlay on a canvas, then export it as plain HTML/CSS/JS you own forever — or grab a hosted URL. Either one pastes straight into OBS as a browser source.

Built for the **Config Makeathon 2026**.

## How it works

1. **Design** your overlay in the visual editor — drag widgets, pick a theme, tweak tokens.
2. **Export** as a ZIP of vanilla HTML/CSS/JS (no lock-in, no build step) or a hosted browser-source URL.
3. **Paste** into OBS. Go live.

## The core idea

The exact same widget code powers the editor previews **and** the exported overlay running in OBS. Every widget is a vanilla Web Component — zero build step, zero framework dependencies.

## Widgets

| Element | What it does |
|---|---|
| `<oo-webcam>` | Webcam frame — wide / standard / circle shapes, optional nametag |
| `<oo-alert>` | Alert box — follow / sub / donation / raid variants |
| `<oo-chat>` | Live Twitch chat via anonymous IRC (read-only, no auth) |
| `<oo-goal>` | Goal / progress bar |
| `<oo-label>` | Text label (e.g. uptime, socials) |

All theming flows through CSS custom properties in `tokens.css` (`--oo-accent`, `--oo-bg`, `--oo-glow`, …) mirroring the Figma design variables 1:1. Themes switch with `[data-theme="neon|minimal|retro"]`.

## Repo structure

```
/widgets          # vanilla Web Components + tokens.css + chat/alert sources + test.html
/export-engine    # overlay template + client-side ZIP packaging (JSZip)
/app              # editor app (built in Figma Make)
/design           # PNG exports from Figma
/docs             # build-in-public workflow + OBS setup guide
```

## Live data

- **Chat:** anonymous Twitch IRC over websocket — `?channel=<your_channel>` on the overlay URL.
- **Alerts & goals:** simulate mode with test-fire buttons (real platform integrations are out of scope for the makeathon).
- **Uptime:** local clock from `?start=` timestamp.

## OBS notes

- Browser source, 1920×1080, transparent background.
- Works from `file://` (ZIP export) and `https://` (hosted).
- See [docs/obs-setup.md](docs/obs-setup.md) for the full guide.

## License

[MIT](LICENSE) — your exported overlay is yours, forever.
