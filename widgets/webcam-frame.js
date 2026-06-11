/*
 * <oo-webcam shape="wide|standard|circle" nametag label="PIXEL EDITS">
 * Transparent window for the camera; OBS shows the video layered underneath.
 * Matches Figma component "webcam-frame".
 */

const TEMPLATE = /* html */ `
<style>
  :host {
    display: block;
    width: 560px;
    aspect-ratio: 16 / 9;
    position: relative;
  }
  :host([shape="standard"]) { width: 420px; aspect-ratio: 4 / 3; }
  :host([shape="circle"])   { width: 280px; aspect-ratio: 1; }

  .frame {
    position: absolute;
    inset: 0;
    border: 3px solid var(--oo-accent);
    border-radius: 16px;
    box-shadow: 0 0 36px var(--oo-glow);
  }
  .inner {
    position: absolute;
    inset: 6px;
    border: 1px solid var(--oo-border);
    border-radius: 11px;
  }
  :host([shape="circle"]) .frame,
  :host([shape="circle"]) .inner { border-radius: 50%; }

  .nametag {
    display: none;
    position: absolute;
    left: 16px;
    bottom: 16px;
    padding: 7px 14px;
    background: var(--oo-bg-glass);
    border: 1px solid var(--oo-border);
    border-radius: 999px;
    color: var(--oo-text);
    font-family: var(--oo-font-body);
    font-size: var(--oo-size-s);
    font-weight: 500;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  :host([nametag]) .nametag { display: block; }
  :host([shape="circle"]) .nametag {
    left: 50%;
    transform: translateX(-50%);
  }

  :host(.oo-enter) .frame { animation: oo-pop 0.5s cubic-bezier(0.2, 1.4, 0.4, 1); }
  :host(.oo-exit) { animation: oo-fade 0.3s ease forwards; }
  @keyframes oo-pop { from { transform: scale(0.92); opacity: 0; } }
  @keyframes oo-fade { to { opacity: 0; } }
</style>
<div class="frame"><div class="inner"></div></div>
<div class="nametag"></div>
`;

export class OoWebcam extends HTMLElement {
  static observedAttributes = ["label"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = TEMPLATE;
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    const tag = this.shadowRoot.querySelector(".nametag");
    tag.textContent = this.getAttribute("label") ?? "STREAMER";
  }
}

customElements.define("oo-webcam", OoWebcam);
