import { spawnSync } from "node:child_process";

function run(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (process.env.SITE_NAME === "novara-hyperpay-staging" && process.env.CONTEXT === "production") {
  const url = process.env.NETLIFY_DB_URL;
  if (!url) throw new Error("The HyperPay staging database is not attached to this deploy.");
  process.env.DATABASE_URL = url;
  process.env.DIRECT_URL = url;
  run("node_modules/prisma/build/index.js", ["db", "push", "--skip-generate"]);
}

run("node_modules/next/dist/bin/next", ["build"]);
