import "server-only";

export const envServer = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: process.env.SMTP_PORT!,
  SMTP_SECURE: process.env.SMTP_SECURE!,
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL!,
};
