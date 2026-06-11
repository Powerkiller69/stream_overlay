/*
 * <oo-alert type="follow|sub|donation|raid">
 * Listens to the alert bus (alert-source.js) and pops alerts of its type;
 * type omitted = shows every alert. Burst effect is layered CSS, themes with tokens.
 * Matches Figma component "alert-box".
 */
import { alerts } from "./alert-source.js";

const META = {
  follow:   { eyebrow: "NEW FOLLOWER",   glyph: "♥", alt: false },
  sub:      { eyebrow: "NEW SUBSCRIBER", glyph: "★", alt: true },
  donation: { eyebrow: "DONATION",       glyph: "$",      alt: true },
  raid:     { eyebrow: "RAID INCOMING",  glyph: "⚡", alt: false }
};

const SHOW_MS = 6000;

const TEMPLATE = /* html */ `
<style>
  :host {
    display: block;
    width: 420px;
    font-family: var(--oo-font-body);
  }
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 0 28px 22px;
    background: var(--oo-bg-glass);
    border: 1px solid var(--oo-border);
    border-radius: 18px;
    box-shadow: 0 0 36px var(--oo-glow);
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }
  .card.show { opacity: 1; }

  .strip {
    align-self: stretch;
    height: 3px;
    margin: 0 -28px 8px;
    background: var(--ac);
  }
  .badge {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--ac);
    color: var(--oo-bg);
    font-size: 18px;
    font-weight: 700;
  }
  .eyebrow {
    color: var(--ac);
    font-size: var(--oo-size-s);
    font-weight: 500;
    letter-spacing: 0.22em;
  }
  .username {
    color: var(--oo-text);
    font-family: var(--oo-font-display);
    font-size: var(--oo-size-l);
  }
  .message {
    color: var(--oo-text-dim);
    font-size: var(--oo-size-m);
  }
  .card { --ac: var(--oo-accent); }
  .card[data-alt] { --ac: var(--oo-accent-2); }

  /* burst: token-themed CSS particles behind the card */
  .burst {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .burst i {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ac);
    opacity: 0;
  }
  .card.show.entering .burst i { animation: oo-burst 0.7s ease-out forwards; }
  @keyframes oo-burst {
    0%   { opacity: 1; transform: translate(0, 0) scale(1); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.3); }
  }

  .card.entering { animation: oo-enter 0.45s cubic-bezier(0.2, 1.4, 0.4, 1); }
  .card.exiting  { animation: oo-exit 0.35s ease forwards; }
  @keyframes oo-enter { from { transform: translateY(-24px) scale(0.9); opacity: 0; } }
  @keyframes oo-exit  { to   { transform: translateY(-12px) scale(0.95); opacity: 0; } }
</style>
<div class="card">
  <div class="burst"></div>
  <div class="strip"></div>
  <div class="badge"></div>
  <div class="eyebrow"></div>
  <div class="username"></div>
  <div class="message"></div>
</div>
`;

export class OoAlert extends HTMLElement {
  #unsub = null;
  #timer = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = TEMPLATE;
    const burst = this.shadowRoot.querySelector(".burst");
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("i");
      const angle = (i / 14) * Math.PI * 2;
      const dist = 120 + Math.random() * 80;
      p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      p.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
      p.style.animationDelay = `${Math.random() * 0.1}s`;
      burst.appendChild(p);
    }
  }

  connectedCallback() {
    this.#unsub = alerts.on("alert", (detail) => {
      const filter = this.getAttribute("type");
      if (filter && filter !== detail.type) return;
      this.fire(detail);
    });
  }

  disconnectedCallback() {
    this.#unsub?.();
    clearTimeout(this.#timer);
  }

  /**
   * Show one alert immediately.
   * @param {{type: string, username: string, message: string}} detail
   */
  fire({ type, username, message }) {
    const meta = META[type] ?? META.follow;
    const card = this.shadowRoot.querySelector(".card");
    card.toggleAttribute("data-alt", meta.alt);
    this.shadowRoot.querySelector(".badge").textContent = meta.glyph;
    this.shadowRoot.querySelector(".eyebrow").textContent = meta.eyebrow;
    this.shadowRoot.querySelector(".username").textContent = username;
    this.shadowRoot.querySelector(".message").textContent = message;

    clearTimeout(this.#timer);
    card.classList.remove("exiting", "entering", "show");
    void card.offsetWidth; // restart animations
    card.classList.add("show", "entering");
    this.#timer = setTimeout(() => {
      card.classList.remove("entering");
      card.classList.add("exiting");
      this.#timer = setTimeout(() => card.classList.remove("show", "exiting"), 400);
    }, SHOW_MS);
  }
}

customElements.define("oo-alert", OoAlert);
