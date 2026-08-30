import nodemailer from "nodemailer";

export function mailConfigured() { return Boolean(process.env.SMTP_URL && process.env.MAIL_FROM && process.env.CONTACT_TO_EMAIL); }

export async function sendContactMail(input: { name: string; email: string; company?: string; phone?: string; message: string }) {
  if (!mailConfigured()) return false;
  const transporter = nodemailer.createTransport(process.env.SMTP_URL!);
  const clean = (value?: string) => (value ?? "").replace(/[\r\n]+/g, " ").trim();
  await transporter.sendMail({
    from: process.env.MAIL_FROM!, to: process.env.CONTACT_TO_EMAIL!, replyTo: input.email,
    disableFileAccess: true, disableUrlAccess: true,
    subject: `NOVARA website enquiry from ${clean(input.name)}`,
    text: [
      `Name: ${clean(input.name)}`, `Email: ${input.email}`, `Company: ${clean(input.company) || "—"}`,
      `Phone: ${clean(input.phone) || "—"}`, "", input.message,
    ].join("\n"),
  });
  return true;
}
