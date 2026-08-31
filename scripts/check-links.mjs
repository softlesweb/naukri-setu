import { createClient } from "@sanity/client";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const run = promisify(execFile);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2026-07-31",
  useCdn: false,
});

const docs = await client.fetch(
  '*[_type=="notification"]{_id, title, "url": officialLinks[0].url}',
);
console.log("checking", docs.length, "primary links...");

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function check(url) {
  try {
    const { stdout } = await run("curl", ["-skL", "-o", "/dev/null", "-w", "%{http_code} %{content_type}", "--max-time", "20", "-A", UA, "--range", "0-2048", url]);
    return stdout.trim();
  } catch {
    return "FAIL";
  }
}

const results = [];
for (let i = 0; i < docs.length; i += 10) {
  const batch = docs.slice(i, i + 10);
  const checked = await Promise.all(batch.map(async (d) => ({ ...d, status: await check(d.url) })));
  results.push(...checked);
}

const bad = results.filter((r) => !r.status.startsWith("2") || r.url.includes("https//"));
console.log("\nOK:", results.length - bad.length, " BAD:", bad.length, "\n");
for (const b of bad) console.log(b.status, "|", b._id, "|", b.url);
