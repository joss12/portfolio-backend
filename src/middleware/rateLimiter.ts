import rateLimit from "express-rate-limit";

export const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many request. Please wait a few minutes before trying again.",
  },
});
