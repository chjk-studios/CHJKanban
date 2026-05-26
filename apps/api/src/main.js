// src/main.js
import { Hono } from "hono";
import { cors } from 'hono/cors';
import boards from "./routes/boards.ts";
import columns from "./routes/columns.ts";
import cards from "./routes/cards.ts";
import authRoutes from "./routes/auth.ts";
import { getVersion } from "./utils/version.ts";

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PATCH', 'DELETE'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.route("/boards", boards)
app.route("/columns", columns)
app.route("/cards", cards)
app.route("/auth/", authRoutes)

app.get("/health", (c) => c.json({ status: "ok" }));

app.get("/", (c) => c.json({ version: getVersion() }));

export default app;
