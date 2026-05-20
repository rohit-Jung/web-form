import { WebSocketServer, WebSocket } from "ws"
import type { IncomingMessage, Server } from "node:http"
import { logger } from "@workspace/logger"
import AuthService from "@workspace/services/auth"
import FormService from "@workspace/services/form"

const authService = new AuthService()
const formService = new FormService()

// formId → Set of authenticated WS clients
const subscribers = new Map<string, Set<WebSocket>>()

export function broadcast(formId: string, payload: unknown) {
  const clients = subscribers.get(formId)
  if (!clients) return
  const msg = JSON.stringify(payload)
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) ws.send(msg)
  }
}

function parseCookies(raw: string): Record<string, string> {
  return Object.fromEntries(
    raw.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=")
      return [k?.trim() ?? "", v.join("=")]
    })
  )
}

function removeClient(ws: WebSocket) {
  for (const [formId, clients] of subscribers) {
    clients.delete(ws)
    if (clients.size === 0) subscribers.delete(formId)
  }
}

export function attachWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" })

  wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
    // Authenticate via session cookie on connection
    const cookies = parseCookies(req.headers.cookie ?? "")
    const token = cookies["session_token"]

    if (!token) {
      ws.send(JSON.stringify({ type: "error", message: "Not authenticated" }))
      ws.close(1008, "Unauthorized")
      return
    }

    let userId: string
    try {
      const user = await authService.validateSession(token)
      if (!user) throw new Error("Invalid session")
      userId = user.id
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid session" }))
      ws.close(1008, "Unauthorized")
      return
    }

    ws.send(JSON.stringify({ type: "connected", userId }))

    ws.on("message", async (raw) => {
      let msg: { type: string; formId?: string }
      try {
        msg = JSON.parse(raw.toString()) as typeof msg
      } catch {
        ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }))
        return
      }

      if (msg.type === "subscribe") {
        if (!msg.formId) {
          ws.send(JSON.stringify({ type: "error", message: "formId required" }))
          return
        }
        try {
          const form = await formService.getById(msg.formId)
          if (!form || form.userId !== userId) {
            ws.send(JSON.stringify({ type: "error", message: "Forbidden" }))
            return
          }
          if (!subscribers.has(msg.formId))
            subscribers.set(msg.formId, new Set())
          subscribers.get(msg.formId)!.add(ws)

          const isLive = !!(form.liveUntil && form.liveUntil > new Date())
          ws.send(
            JSON.stringify({
              type: "subscribed",
              formId: msg.formId,
              isLive,
              liveUntil: form.liveUntil?.toISOString() ?? null,
            })
          )
          logger.info("WS subscribed", { formId: msg.formId, userId })
        } catch {
          ws.send(
            JSON.stringify({ type: "error", message: "Subscription failed" })
          )
        }
      }

      if (msg.type === "unsubscribe" && msg.formId) {
        subscribers.get(msg.formId)?.delete(ws)
        ws.send(JSON.stringify({ type: "unsubscribed", formId: msg.formId }))
      }
    })

    ws.on("close", () => removeClient(ws))
    ws.on("error", () => removeClient(ws))
  })

  logger.info("WebSocket server attached at /ws")
  return wss
}
