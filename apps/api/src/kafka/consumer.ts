import { consumer, TOPIC_FORM_RESPONSES } from "./index"
import { broadcast } from "../websocket"
import { logger } from "@workspace/logger"

export async function startConsumer() {
  await consumer.connect()
  await consumer.subscribe({
    topic: TOPIC_FORM_RESPONSES,
    fromBeginning: false,
  })

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return
      try {
        const payload = JSON.parse(message.value.toString()) as {
          formId: string
          submission: unknown
          ts: number
        }
        broadcast(payload.formId, {
          type: "new_response",
          formId: payload.formId,
          submission: payload.submission,
          ts: payload.ts,
        })
      } catch (err) {
        logger.warn("Kafka consumer parse error", { err })
      }
    },
  })

  logger.info("Kafka consumer running — topic: " + TOPIC_FORM_RESPONSES)
}
