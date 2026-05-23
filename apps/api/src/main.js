// src/main.js
import { Hono } from "hono";
import { cors } from 'hono/cors';
import boards from "./routes/boards.ts";
import columns from "./routes/columns.ts";
import cards from "./routes/cards.ts";
import authRoutes from "./routes/auth.ts";

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.route("/boards", boards)
app.route("/columns", columns)
app.route("/cards", cards)
app.route("/auth/", authRoutes)


app.get("/", (c) => c.text("Hello World!"));

export default app;
