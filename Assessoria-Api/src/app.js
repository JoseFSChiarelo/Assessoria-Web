import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { router } from "./routes/index.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok", at: new Date().toISOString() });
});

app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
