/**
 * Deletes the seeded sample/dummy documents from the Sanity dataset.
 * Only documents whose _id carries the seed scripts' "sample" prefixes are
 * touched; scraped drafts (scraped-*) and hand-authored content are kept.
 *
 * Usage:
 *   node --env-file=.env.local scripts/remove-sample-data.mjs --dry-run
 *   node --env-file=.env.local scripts/remove-sample-data.mjs
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN are required.",
  );
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token,
  apiVersion: "2026-07-31",
  useCdn: false,
});

const dryRun = process.argv.includes("--dry-run");

const sampleDocs = await client.fetch(
  `*[
    _id match "sample-*" ||
    _id match "drafts.sample-*" ||
    _id match "notification.sample-*" ||
    _id match "organisation.sample.*" ||
    _id match "drafts.notification.sample-*" ||
    _id match "drafts.organisation.sample.*"
  ]{_id, _type, title, name}`,
);

if (sampleDocs.length === 0) {
  console.log("No sample documents found — nothing to delete.");
  process.exit(0);
}

console.log(`${sampleDocs.length} sample documents${dryRun ? " (dry run, keeping them)" : " to delete"}:`);
for (const doc of sampleDocs) {
  console.log(`  ${doc._type} | ${doc._id} | ${doc.title ?? doc.name ?? ""}`);
}

if (!dryRun) {
  // Notifications reference organisations, so remove everything in one
  // transaction to avoid reference-integrity failures mid-way.
  let transaction = client.transaction();
  for (const doc of sampleDocs) transaction = transaction.delete(doc._id);
  await transaction.commit({ visibility: "sync" });
  const remaining = await client.fetch(
    'count(*[_type in ["notification", "organisation"]])',
  );
  console.log(`\nDeleted ${sampleDocs.length} documents. Remaining notification/organisation documents: ${remaining}`);
}
