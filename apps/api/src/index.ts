import express from "express"
import { env } from "@workspace/config/env"
import { createExpressMiddleware } from "@trpc/server/adapters/express"
import { appRouter, createContext } from "@workspace/trpc/server"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
)

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
)

app.listen(env.PORT, () => {
  console.log(`Server is listening at ${env.PORT}`)
})
