import { Kafka, logLevel } from "kafkajs"

export const TOPIC_FORM_RESPONSES = "form-responses"

export const kafka = new Kafka({
  clientId: "webform-api",
  brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"],
  logLevel: logLevel.WARN,
})

export const producer = kafka.producer()
export const consumer = kafka.consumer({ groupId: "webform-ws-group" })
