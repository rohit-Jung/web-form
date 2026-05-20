import { producer, TOPIC_FORM_RESPONSES } from "./index"
import { logger } from "@workspace/logger"

export async function publishSubmission(formId: string, submission: unknown) {
  try {
    await producer.send({
      topic: TOPIC_FORM_RESPONSES,
      messages: [
        {
          key: formId,
          value: JSON.stringify({ formId, submission, ts: Date.now() }),
        },
      ],
    })
  } catch (err) {
    logger.warn("Kafka publish failed", { err, formId })
  }
}
