import { Router, Request, Response } from "express";
import { z } from "zod";
import { sendContactEmail } from "../services/mailer";
import { contactRateLimit } from "../middleware/rateLimiter";
import { filterXSS } from "xss";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  email: z.string().email("Invalid email address").max(254).trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 charaters")
    .max(2000)
    .trim(),
});

function sanitize(str: string): string {
  return filterXSS(str, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"],
  });
}

router.post("/", contactRateLimit, async (req: Request, res: Response) => {
  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).json({ success: false, errors });
  }

  const sanitized = {
    name: sanitize(result.data.name),
    email: sanitize(result.data.email),
    message: sanitize(result.data.message),
  };

  try {
    await sendContactEmail(result.data);
    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  }
});

export default router;
