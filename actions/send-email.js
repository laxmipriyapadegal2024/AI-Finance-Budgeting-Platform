"use server";

import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY in environment");
    return { success: false, error: "Missing RESEND_API_KEY" };
  }
  
  const resend = new Resend(apiKey);

  try {
    console.log(`Sending email to ${to} with subject: ${subject}`);
    const data = await resend.emails.send({
      from: "Finance App <onboarding@resend.dev>",
      to,
      subject,
      react,
    });

    console.log(`Email sent successfully to ${to}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: error.message || error };
  }
}
