import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { contactFormTemplate } from "@/lib/emailTemplates";

export const maxDuration = 30;

const CONTACT_EMAIL = "cryptaraholding@outlook.com";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long" },
        { status: 400 }
      );
    }

    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `Contact form: ${name}`,
      html: contactFormTemplate(name, email, message),
      replyTo: email,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}