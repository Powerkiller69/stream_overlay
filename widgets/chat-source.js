/*
 * OpenOverlay — anonymous Twitch chat feed.
 * Read-only IRC over websocket, no auth (justinfan nick). Reconnects with backoff.
 * Usage:
 *   import { connectChat } from "./chat-source.js";
 *   const chat = connectChat("pixelpataka", msg => { ... });
 *   chat.close();
 */

const IRC_URL = "wss://irc-ws.chat.twitch.tv:443";

/**
 * Parse IRCv3 tags ("@k=v;k2=v2 ...") into an object.
 * @param {string} raw
 */
function parseTags(raw) {
  const tags = {};
  for (const part of raw.split(";")) {
    const eq = part.indexOf("=");
    if (eq > 0) tags[part.slice(0, eq)] = part.slice(eq + 1);
  }
  return tags;
}

/**
 * Connect to a channel's chat anonymously.
 * @param {string} channel  channel login name, without '#'
 * @param {(msg: {username: string, color: string, text: string}) => void} onMessage
 * @returns {{ close(): void }}
 */
export function connectChat(channel, onMessage) {
  let ws = null;
  let closed = false;
  let retryMs = 1000;

  const open = () => {
    if (closed) return;
    ws = new WebSocket(IRC_URL);

    ws.addEventListener("open", () => {
      retryMs = 1000;
      ws.send("CAP REQ :twitch.tv/tags");
      ws.send(`NICK justinfan${Math.floor(Math.random() * 80000) + 1000}`);
      ws.send(`JOIN #${channel.toLowerCase()}`);
    });

    ws.addEventListener("message", (e) => {
      for (const line of e.data.split("\r\n")) {
        if (!line) continue;
        if (line.startsWith("PING")) {
          ws.send("PONG :tmi.twitch.tv");
          continue;
        }
        if (!line.includes("PRIVMSG")) continue;

        let tags = {};
        let rest = line;
        if (rest.startsWith("@")) {
          const sp = rest.indexOf(" ");
          tags = parseTags(rest.slice(1, sp));
          rest = rest.slice(sp + 1);
        }
        const m = rest.match(/^:(\w+)!.* PRIVMSG #\w+ :(.*)$/);
        if (!m) continue;
        onMessage({
          username: tags["display-name"] || m[1],
          color: tags["color"] || "",
          text: m[2]
        });
      }
    });

    ws.addEventListener("close", () => {
      if (closed) return;
      setTimeout(open, retryMs);
      retryMs = Math.min(retryMs * 2, 30000);
    });
    ws.addEventListener("error", () => ws.close());
  };

  open();
  return {
    close() {
      closed = true;
      ws?.close();
    }
  };
}
