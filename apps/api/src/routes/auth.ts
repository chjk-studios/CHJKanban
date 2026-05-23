import { Hono } from 'hono'
import { auth } from "../utils/auth.ts";

const authRoutes = new Hono()

authRoutes.on(["POST", "GET"], "*", (c)=> auth.handler(c.req.raw));

export default authRoutes;