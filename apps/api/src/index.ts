import "dotenv/config"
import http from "node:http"
import { logger } from "@workspace/logger"
import { app } from "./server"
import { env } from "./env"
import { attachWebSocket } from "./websocket"
import { producer } from "./kafka/index"
import { publishSubmission } from "./kafka/producer"
import { startConsumer } from "./kafka/consumer"
import { setKafkaPublisher } from "@workspace/services/submission"

async function init() {
  try {
    const server = http.createServer(app)

    // socket.io (must attach before listen)
    const io = attachWebSocket(server)

    // kafka
    await producer.connect()
    setKafkaPublisher(publishSubmission)
    logger.info("Kafka producer connected")

    startConsumer().catch((err) => {
      logger.warn("Kafka consumer failed to start (Kafka may not be running)", {
        err,
      })
    })

    server.listen(env.PORT, () => {
      logger.info(`WebForm API running on port ${env.PORT}`)
      logger.debug(`tRPC:      http://localhost:${env.PORT}/trpc`)
      logger.debug(`WebSocket: ws://localhost:${env.PORT}/ws`)
    })

    const shutdown = async () => {
      logger.info("Shutting down...")
      io.close()
      await producer.disconnect().catch(() => null)
      process.exit(0)
    }

    process.on("SIGTERM", shutdown)
    process.on("SIGINT", shutdown)
  } catch (err) {
    logger.error("Failed to start server", { err })
    process.exit(1)
  }
}

init()
