import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const branch = execSync("git rev-parse --abbrev-ref HEAD", {
  cwd: repoRoot,
  encoding: "utf8",
}).trim();

if (branch !== "main" && branch !== "master") {
  process.exit(0);
}

execSync("npm run codecheck", { cwd: repoRoot, stdio: "inherit" });
