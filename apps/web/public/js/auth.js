import { createAuthClient } from "https://esm.sh/better-auth/client"

const normalizeBaseUrl = (url) => (url || "").replace(/\/+$/, "");
const baseURL = normalizeBaseUrl(
    window.__BACKEND_URL || "https://gbd5qjlc-3000.euw.devtunnels.ms"
);

export const authClient = createAuthClient({
    baseURL: `${baseURL}/auth`
})