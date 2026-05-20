import { Resend } from "resend"
import { env } from "../env"
import { logger } from "@workspace/logger"

let client: Resend | null = null

function getClient() {
  if (!env.RESEND_API_KEY) return null
  if (!client) client = new Resend(env.RESEND_API_KEY)
  return client
}

export async function sendCreatorNotification({
  creatorEmail,
  creatorName,
  formTitle,
  respondentEmail,
}: {
  creatorEmail: string
  creatorName: string
  formTitle: string
  respondentEmail?: string | null
}) {
  const resend = getClient()
  if (!resend) return

  try {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: creatorEmail,
      subject: `New response: ${formTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#CC0000;padding:24px;border-bottom:4px solid #0a0a0a">
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:900;letter-spacing:-1px">NEW RESPONSE</h1>
          </div>
          <div style="border:4px solid #0a0a0a;border-top:none;padding:24px;background:#fff">
            <p style="margin:0 0 8px">Hi <strong>${creatorName}</strong>,</p>
            <p style="margin:0 0 16px;color:#555">Someone just submitted a response to <strong>${formTitle}</strong>.</p>
            ${respondentEmail ? `<p style="margin:0 0 16px;color:#555">Respondent email: <strong>${respondentEmail}</strong></p>` : ""}
            <p style="margin:0;color:#999;font-size:12px">Powered by WebForm</p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    logger.warn("Failed to send creator notification email", { err })
  }
}

export async function sendRespondentConfirmation({
  respondentEmail,
  formTitle,
}: {
  respondentEmail: string
  formTitle: string
}) {
  const resend = getClient()
  if (!resend) return

  try {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: respondentEmail,
      subject: `Your response to "${formTitle}" was received`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#003366;padding:24px;border-bottom:4px solid #0a0a0a">
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:900;letter-spacing:-1px">RESPONSE RECEIVED</h1>
          </div>
          <div style="border:4px solid #0a0a0a;border-top:none;padding:24px;background:#fff">
            <p style="margin:0 0 16px">Thanks for filling out <strong>${formTitle}</strong>!</p>
            <p style="margin:0;color:#999;font-size:12px">Powered by WebForm</p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    logger.warn("Failed to send respondent confirmation email", { err })
  }
}
