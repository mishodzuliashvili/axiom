"use server";
import createServerAction from "@/lib/utils/createServerAction";
import { z } from "zod";
import nodemailer from "nodemailer";
import { envServer } from "@/lib/envServer";

export const sendEmail = createServerAction(
  z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    subject: z.string().min(1),
    message: z.string().min(1),
  }),
  async ({ email, message, name, subject }) => {
    const transporter = nodemailer.createTransport({
      host: envServer.SMTP_HOST,
      port: parseInt(envServer.SMTP_PORT),
      secure: envServer.SMTP_SECURE === "true",
      auth: {
        user: envServer.SMTP_USER,
        pass: envServer.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Contact Form" <${envServer.SMTP_USER}>`,
      to: envServer.CONTACT_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `
          Name: ${name}
          Email: ${email}
          Subject: ${subject}
          
          Message:
          ${message}
        `,
      html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  }
);
