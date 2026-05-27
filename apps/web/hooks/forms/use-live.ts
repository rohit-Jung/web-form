"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { io, Socket } from "socket.io-client"

export interface LiveSubmission {
  id: string
  formId: string
  respondentEmail: string | null
  submittedAt: string | null
  answers: { fieldId: string; value: string }[]
}

type WsStatus = "connecting" | "connected" | "subscribed" | "error" | "closed"

export function useFormLive(formId: string, enabled: boolean) {
  const [submissions, setSubmissions] = useState<LiveSubmission[]>([])
  const [isLive, setIsLive] = useState(false)
  const [liveUntil, setLiveUntil] = useState<string | null>(null)
  const [status, setStatus] = useState<WsStatus>("closed")
  const socketRef = useRef<Socket | null>(null)

  const reset = useCallback(() => {
    setSubmissions([])
    setIsLive(false)
    setLiveUntil(null)
    setStatus("closed")
  }, [])

  useEffect(() => {
    if (!enabled) {
      reset()
      return
    }

    const url = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8080"
    setStatus("connecting")

    const socket = io(url, {
      path: "/ws",
      transports: ["websocket"],
      withCredentials: true,
    })

    socketRef.current = socket
    socket.on("connect", () => {
      setStatus("connected")
      socket.emit("subscribe", { formId })
    })

    socket.on(
      "subscribed",
      (data: { formId: string; isLive: boolean; liveUntil: string | null }) => {
        setStatus("subscribed")
        setIsLive(data.isLive)
        setLiveUntil(data.liveUntil)
      }
    )

    socket.on(
      "new_response",
      (data: { formId: string; submission: LiveSubmission; ts: number }) => {
        setSubmissions((prev) => [data.submission, ...prev])
      }
    )

    socket.on("live_ended", () => {
      setIsLive(false)
      setLiveUntil(null)
    })

    socket.on("connect_error", () => setStatus("error"))
    socket.on("disconnect", () => setStatus("closed"))

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [formId, enabled, reset])

  return { submissions, isLive, liveUntil, status }
}
