import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";

export async function sendEmail({ to, subject, html }) {
  try {
    const result = await resend.emails.send({
      from: `Cryptara Holdings <${FROM}>`,
      to,
      subject,
      html,
    });
    return result;
  } catch (err) {
    // Email failures should never block the underlying action
    // (registration, deposit approval, etc.) — just log it.
    console.error("Email send error:", err);
    return null;
  }
}