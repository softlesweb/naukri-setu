import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

if (!projectId) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID in .env.local.",
  );
}

export default defineConfig({
  name: "naukri-setu",
  title: "NaukriSetu CMS",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
