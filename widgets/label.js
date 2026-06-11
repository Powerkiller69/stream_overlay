/*
 * <oo-label type="uptime|socials" text="@pixelpataka" start="1718100000000">
 * uptime: ticking clock from ?start= (ms epoch) or page load. socials: static text.
 * Matches Figma component "stream-label".
 */

const TEMPLATE = /* html */ `
<style>
  :host {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    background: var(--oo-bg-glass);
    border: 1px solid var(--oo-border);
    border-radius: 999px;
    font-family: var(--oo-font-body);
    font-size: var(--oo-size-s);
    font-weight: 600;
    letter-spacing: 0.07em;
    color: var(--oo-text);
    --ac: var(--oo-accent);
  }
  :host([type="socials"]) { --ac: var(--oo-accent-2); }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ac);
    box-shadow: 0 0 8px var(--oo-glow);
  }
  :host([type="uptime"]) .dot { animation: oo-pulse 2s ease-in-out infinite; }
  @keyframes oo-pulse { 50% { opacity: 0.4; } }
</style>
<span class="dot"></span>
<span class="text"></span>
`;

export class OoLabel extends HTMLElement {
  static observedAttributes = ["text"];
  #timer = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = TEMPLATE;
  }

  connectedCallback() {
    if ((this.getAttribute("type") ?? "uptime") === "uptime") {
      const param = new URLSearchParams(location.search).get("start");
      const start = Number(this.getAttribute("start") ?? param) || Date.now();
      const tick = () => {
        const s = Math.max(0, Math.floor((Date.now() - start) / 1000));
        const hh = String(Math.floor(s / 3600)).padStart(2, "0");
        const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
        const ss = String(s % 60).padStart(2, "0");
        this.shadowRoot.querySelector(".text").textContent = `LIVE  ${hh}:${mm}:${ss}`;
      };
      tick();
      this.#timer = setInterval(tick, 1000);
    } else {
      this.#render();
    }
  }

  disconnectedCallback() {
    clearInterval(this.#timer);
  }

  attributeChangedCallback() {
    if (this.shadowRoot && this.getAttribute("type") === "socials") this.#render();
  }

  #render() {
    this.shadowRoot.querySelector(".text").textContent =
      this.getAttribute("text") ?? "@yourhandle";
  }
}

customElements.define("oo-label", OoLabel);
