/**
 * Deletes all scraper-imported documents (ids starting with "scraped-")
 * so a corrected scrape can re-import them cleanly.
 *
 * Usage: node --env-file=.env.local scripts/remove-scraped-data.mjs [--dry-run]
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN are required.");
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token,
  apiVersion: "2026-07-31",
  useCdn: false,
});

const dryRun = process.argv.includes("--dry-run");
const ids = await client.fetch(
  '*[_id match "scraped-*" || _id match "drafts.scraped-*"]._id',
);
console.log(`${ids.length} scraped documents${dryRun ? " (dry run)" : ""}`);
if (!dryRun && ids.length) {
  let tx = client.transaction();
  for (const id of ids) tx = tx.delete(id);
  await tx.commit({ visibility: "sync" });
  console.log("Deleted.");
}
