import "server-only";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-07-31",
  // Next.js provides the five-minute cache. Reading the API directly avoids a
  // second CDN cache hiding freshly published or seeded records.
  useCdn: false,
  perspective: "published",
});
