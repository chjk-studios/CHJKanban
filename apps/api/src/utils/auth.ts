import { betterAuth } from "better-auth";
import Database from "bun:sqlite";

export const auth = betterAuth({
    emailAndPassword: { 
        enabled: true, 
    }, 
    database: new Database("./src/data/auth.db"),
})