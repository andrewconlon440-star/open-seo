// Launch the pinned CLI without POSIX-only environment assignment. Node inherits
// the caller's NODE_OPTIONS; the required flag is passed without a shell on every OS.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const packageUrl = new URL(
  "../node_modules/alchemy/package.json",
  import.meta.url,
);
const metadata = JSON.parse(readFileSync(packageUrl, "utf8"));
const bin =
  typeof metadata.bin === "string" ? metadata.bin : metadata.bin?.alchemy;
if (!bin)
  throw new Error("The installed Alchemy package has no CLI entry point.");

const result = spawnSync(
  process.execPath,
  [
    "--experimental-strip-types",
    fileURLToPath(new URL(bin, packageUrl)),
    ...process.argv.slice(2),
  ],
  { stdio: "inherit", env: process.env },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
