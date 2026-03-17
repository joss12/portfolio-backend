import nodemailer from "nodemailer";
import { config } from "../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.gmail.user,
    pass: config.gmail.appPassword,
  },
});

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const { name, email, message } = payload;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${config.gmail.user}>`,
    to: config.recipientEmail,
    replyTo: email,
    subject: `New message from ${name}`,
    text: `
Name:    ${name}
Email:   ${email}

Message:
${message}
    `.trim(),
    html: `
      <div style="font-family: monospace; max-width: 600px; padding: 32px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="margin: 0 0 24px; font-size: 18px; color: #111;">New contact message</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 12px; background: #eee; font-weight: 600; width: 80px;">Name</td>
            <td style="padding: 8px 12px; background: #fff;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #eee; font-weight: 600;">Email</td>
            <td style="padding: 8px 12px; background: #fff;">
              <a href="mailto:${email}" style="color: #00b4d8;">${email}</a>
            </td>
          </tr>
        </table>
        <div style="background: #fff; padding: 16px; border-left: 3px solid #00b4d8; border-radius: 0 6px 6px 0;">
          <p style="margin: 0; white-space: pre-wrap; color: #333; line-height: 1.6;">${message}</p>
        </div>
        <p style="margin: 24px 0 0; font-size: 12px; color: #999;">
          Reply directly to this email to respond to ${name}.
        </p>
      </div>
    `,
  });
}

export async function verifyMailer(): Promise<void> {
  await transporter.verify();
  console.log("Mailer connected to Gmail");
}
