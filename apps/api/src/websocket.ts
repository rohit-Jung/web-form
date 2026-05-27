import { Server } from "socket.io"
import type { Server as HttpServer } from "node:http"
import { logger } from "@workspace/logger"
import AuthService from "@workspace/services/auth"
import FormService from "@workspace/services/form"
import { env } from "./env"

const authService = new AuthService()
const formService = new FormService()

let io: Server

export function broadcast(formId: string, payload: unknown) {
  if (!io) return
  const { type, ...data } = payload as Record<string, unknown>
  io.to(formId).emit(type as string, data)
}

function parseCookies(raw: string): Record<string, string> {
  return Object.fromEntries(
    raw.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=")
      return [k?.trim() ?? "", v.join("=")]
    })
  )
}

export function attachWebSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  })

  io.use(async (socket, next) => {
    const cookies = parseCookies(socket.handshake.headers.cookie ?? "")
    const token = cookies["session_token"]

    if (!token) return next(new Error("Not authenticated"))

    try {
      const user = await authService.validateSession(token)
      if (!user) return next(new Error("Invalid session"))
      socket.data.userId = user.id
      next()
    } catch {
      next(new Error("Invalid session"))
    }
  })

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string

    socket.emit("connected", { userId })

    socket.on("subscribe", async ({ formId }: { formId?: string }) => {
      if (!formId) {
        socket.emit("error", { message: "formId required" })
        return
      }

      try {
        const form = await formService.getById(formId)
        if (!form || form.userId !== userId) {
          socket.emit("error", { message: "Forbidden" })
          return
        }

        await socket.join(formId)

        const isLive = !!(form.liveUntil && form.liveUntil > new Date())
        socket.emit("subscribed", {
          formId,
          isLive,
          liveUntil: form.liveUntil?.toISOString() ?? null,
        })
        logger.info("WS subscribed", { formId, userId })
      } catch {
        socket.emit("error", { message: "Subscription failed" })
      }
    })

    socket.on("unsubscribe", async ({ formId }: { formId?: string }) => {
      if (!formId) return
      await socket.leave(formId)
      socket.emit("unsubscribed", { formId })
    })
  })

  logger.info("Socket.IO server attached at /ws")
  return io
}
