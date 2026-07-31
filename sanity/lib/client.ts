import "server-only";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
}

export const sanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-31",
  // Query the API directly so newly published Studio content is immediately
  // available. `token` is optional for public datasets and server-only.
  useCdn: false,
  perspective: "published",
});
