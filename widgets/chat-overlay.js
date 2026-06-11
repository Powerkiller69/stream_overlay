/*
 * <oo-chat style-variant="compact|bubble" channel="pixelpataka" max="12">
 * Live Twitch chat via chat-source.js (anonymous, read-only).
 * No channel attribute -> uses ?channel= from the page URL.
 * Matches Figma component "chat-overlay".
 */
import { connectChat } from "./chat-source.js";

const TEMPLATE = /* html */ `
<style>
  :host {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 340px;
    height: 480px;
    padding: 8px;
    box-sizing: border-box;
    gap: 6px;
    overflow: hidden;
    font-family: var(--oo-font-body);
    font-size: var(--oo-size-s);
  }
  :host([style-variant="bubble"]) { gap: 10px; }

  .msg {
    display: flex;
    gap: 6px;
    align-items: baseline;
    animation: oo-slide 0.25s ease;
  }
  .user { color: var(--uc, var(--oo-accent)); font-weight: 600; }
  .text { color: var(--oo-text); overflow-wrap: anywhere; }

  :host([style-variant="bubble"]) .msg {
    flex-direction: row;
    align-items: stretch;
    gap: 10px;
    align-self: flex-start;
    background: var(--oo-bg-glass);
    border: 1px solid var(--oo-border);
    border-radius: 12px;
    padding: 8px 14px 8px 0;
    overflow: hidden;
  }
  :host([style-variant="bubble"]) .edge {
    width: 3px;
    border-radius: 2px;
    background: var(--uc, var(--oo-accent));
  }
  :host(:not([style-variant="bubble"])) .edge { display: none; }
  :host([style-variant="bubble"]) .body {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  :host(:not([style-variant="bubble"])) .body { display: contents; }
  :host(:not([style-variant="bubble"])) .user::after { content: ":"; }

  @keyframes oo-slide { from { transform: translateY(8px); opacity: 0; } }
</style>
`;

export class OoChat extends HTMLElement {
  #chat = null;
  #alt = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = TEMPLATE;
  }

  connectedCallback() {
    const channel = this.getAttribute("channel") ||
      new URLSearchParams(location.search).get("channel");
    if (channel) {
      this.#chat = connectChat(channel, (m) => this.addMessage(m));
    }
  }

  disconnectedCallback() {
    this.#chat?.close();
  }

  /**
   * Append one chat line (also used by test-fire / preview mode).
   * @param {{username: string, color?: string, text: string}} m
   */
  addMessage({ username, color, text }) {
    const max = Number(this.getAttribute("max")) || 12;
    const msg = document.createElement("div");
    msg.className = "msg";
    // Twitch user color when set, otherwise alternate accent tokens
    msg.style.setProperty("--uc", color || (this.#alt ? "var(--oo-accent-2)" : "var(--oo-accent)"));
    this.#alt = !this.#alt;

    const edge = document.createElement("div");
    edge.className = "edge";
    const body = document.createElement("div");
    body.className = "body";
    const user = document.createElement("span");
    user.className = "user";
    user.textContent = username;
    const textEl = document.createElement("span");
    textEl.className = "text";
    textEl.textContent = text;
    body.append(user, textEl);
    msg.append(edge, body);
    this.shadowRoot.appendChild(msg);

    const msgs = this.shadowRoot.querySelectorAll(".msg");
    for (let i = 0; i < msgs.length - max; i++) msgs[i].remove();
  }
}

customElements.define("oo-chat", OoChat);
