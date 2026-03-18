import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required enviroment variable: ${key}`);
  return value;
}

export const config = {
  port: parseInt(process.env.PORT ?? "8086", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  resendApiKey: requireEnv("RESEND_API_KEY"),
  recipientEmail: requireEnv("RECIPIENT_EMAIL"),
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? "http://localhost:3004",
};
