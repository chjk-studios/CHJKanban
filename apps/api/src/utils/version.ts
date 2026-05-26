import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageJsonPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "package.json"
);

export function getVersion() {
    try {
        const raw = readFileSync(packageJsonPath, "utf8");
        const pkg = JSON.parse(raw) as { version?: string };
        return pkg.version ?? "unknown";
    } catch {
        return "unknown";
    }
}