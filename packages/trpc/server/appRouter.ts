import { router } from "./trpc"
import { authRouter } from "./routes/auth/route"
import { fieldRouter } from "./routes/field/route"
import { formRouter } from "./routes/form/route"
import { healthRouter } from "./routes/health/route"
import { submissionRouter } from "./routes/submission/route"
import { userRouter } from "./routes/user/route"

export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
  field: fieldRouter,
  submission: submissionRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
export type ServerRouter = AppRouter
