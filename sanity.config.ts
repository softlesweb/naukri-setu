import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { visionTool } from "@sanity/vision";

// NEXT_PUBLIC_* values are inlined into the browser bundle, which the
// embedded /admin studio needs; SANITY_STUDIO_* keeps `sanity dev` working.
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID) in .env.local.",
  );
}

export default defineConfig({
  name: "naukri-setu",
  title: "NaukriSetu CMS",
  projectId,
  dataset,
  basePath: "/admin",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
