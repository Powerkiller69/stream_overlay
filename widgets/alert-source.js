/*
 * OpenOverlay — alert event bus.
 * Simulate-only by design (no platform OAuth before deadline).
 * Usage:
 *   import { alerts, simulate } from "./alert-source.js";
 *   alerts.on("alert", ({ type, username, message }) => { ... });
 *   simulate("follow");
 */

const SAMPLE_NAMES = [
  "PixelFan_99", "night_owl42", "luna_streams", "raid_boss",
  "clutch_queen", "spike_planter", "vandal_main", "whiff_lord"
];

const DEFAULT_MESSAGES = {
  follow: () => "just followed the stream",
  sub: () => `subscribed for ${1 + Math.floor(Math.random() * 12)} months`,
  donation: () => `donated $${(Math.random() * 20 + 1).toFixed(2)}`,
  raid: () => `is raiding with ${5 + Math.floor(Math.random() * 95)} viewers`
};

class AlertBus extends EventTarget {
  /**
   * Subscribe to alert events.
   * @param {"alert"} type
   * @param {(detail: {type: string, username: string, message: string}) => void} handler
   * @returns {() => void} unsubscribe
   */
  on(type, handler) {
    const wrapped = (e) => handler(e.detail);
    this.addEventListener(type, wrapped);
    return () => this.removeEventListener(type, wrapped);
  }

  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

export const alerts = new AlertBus();

/**
 * Fire a fake alert through the bus.
 * @param {"follow"|"sub"|"donation"|"raid"} type
 * @param {{username?: string, message?: string}} [payload]
 */
export function simulate(type, payload = {}) {
  const username = payload.username ??
    SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
  const message = payload.message ?? (DEFAULT_MESSAGES[type] ?? (() => ""))();
  alerts.emit("alert", { type, username, message });
}
