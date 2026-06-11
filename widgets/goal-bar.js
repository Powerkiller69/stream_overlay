/*
 * <oo-goal type="follower|donation" label="FOLLOWER GOAL" current="1284" goal="2000" prefix="">
 * Progress bar on the alert bus: simulate("follow") bumps a follower goal,
 * simulate("donation", {amount}) bumps a donation goal.
 * Matches Figma component "goal-bar".
 */
import { alerts } from "./alert-source.js";

const TEMPLATE = /* html */ `
<style>
  :host {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 480px;
    box-sizing: border-box;
    padding: 12px 16px 14px;
    background: var(--oo-bg-glass);
    border: 1px solid var(--oo-border);
    border-radius: 14px;
    font-family: var(--oo-font-body);
    --ac: var(--oo-accent);
  }
  :host([type="donation"]) { --ac: var(--oo-accent-2); }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
  }
  .label {
    color: var(--oo-text-dim);
    font-size: var(--oo-size-s);
    font-weight: 500;
    letter-spacing: 0.11em;
  }
  .nums { display: flex; gap: 10px; align-items: baseline; }
  .value { color: var(--oo-text); font-size: var(--oo-size-s); font-weight: 600; }
  .pct { color: var(--ac); font-size: 12px; font-weight: 700; }

  .track {
    position: relative;
    height: 14px;
    background: var(--oo-bg-glass);
    border: 1px solid var(--oo-border);
    border-radius: 999px;
  }
  .fill {
    position: absolute;
    inset: 0 auto 0 0;
    width: 0%;
    border-radius: 999px;
    background: var(--ac);
    box-shadow: 0 0 10px var(--oo-glow);
    transition: width 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
  }
  .knob {
    position: absolute;
    top: 50%;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--oo-text);
    border: 3px solid var(--ac);
    box-shadow: 0 0 10px var(--oo-glow);
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    transition: left 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
  }
</style>
<div class="header">
  <span class="label"></span>
  <span class="nums"><span class="value"></span><span class="pct"></span></span>
</div>
<div class="track"><div class="fill"></div><div class="knob"></div></div>
`;

export class OoGoal extends HTMLElement {
  static observedAttributes = ["label", "current", "goal", "prefix"];
  #unsub = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = TEMPLATE;
  }

  connectedCallback() {
    this.#render();
    this.#unsub = alerts.on("alert", ({ type, message }) => {
      const kind = this.getAttribute("type") ?? "follower";
      if (kind === "follower" && type === "follow") {
        this.setAttribute("current", String(this.#num("current") + 1));
      }
      if (kind === "donation" && type === "donation") {
        const amt = Number(message.match(/[\d.]+/)?.[0] ?? 5);
        this.setAttribute("current", String(this.#num("current") + amt));
      }
    });
  }

  disconnectedCallback() {
    this.#unsub?.();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.#render();
  }

  #num(attr) {
    return Number(this.getAttribute(attr)) || 0;
  }

  #render() {
    const current = this.#num("current");
    const goal = this.#num("goal") || 1;
    const prefix = this.getAttribute("prefix") ?? "";
    const pct = Math.min(100, Math.round((current / goal) * 100));
    const fmt = (n) => prefix + (Number.isInteger(n) ? n.toLocaleString() : n.toFixed(2));

    this.shadowRoot.querySelector(".label").textContent =
      this.getAttribute("label") ?? "GOAL";
    this.shadowRoot.querySelector(".value").textContent = `${fmt(current)} / ${fmt(goal)}`;
    this.shadowRoot.querySelector(".pct").textContent = pct + "%";
    this.shadowRoot.querySelector(".fill").style.width = pct + "%";
    this.shadowRoot.querySelector(".knob").style.left = pct + "%";
  }
}

customElements.define("oo-goal", OoGoal);
