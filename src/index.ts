import express from "express";
import cors from "cors";
import { config } from "./config/env";
import { verifyMailer } from "./services/mailer";
import contactRouter from "./routes/contact";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.disable("x-powered-by");

app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    origin: config.allowedOrigin,
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

app.use("/api/contact", contactRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("[error]", err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  },
);

async function start() {
  try {
    verifyMailer()
      .then(() => {
        console.log("-> All Connected...");
      })
      .catch((err) => {
        console.warn("-> Resend connection warning:", err.message);
      });

    app.listen(config.port, () => {
      console.log(
        `-> Server running on port ${config.port} [${config.nodeEnv}]`,
      );
    });
  } catch (err) {
    console.error("-> Failed to start server:", err);
    process.exit(1);
  }
}

start();
