import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("uses standard Next.js without Cloudflare infrastructure", async () => {
  const [packageSource, nextConfig, gitignore, pnpmWorkspace] =
    await Promise.all([
      readFile(new URL("package.json", root), "utf8"),
      readFile(new URL("next.config.ts", root), "utf8"),
      readFile(new URL(".gitignore", root), "utf8"),
      readFile(new URL("pnpm-workspace.yaml", root), "utf8"),
    ]);
  const packageJson = JSON.parse(packageSource);

  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.dependencies.next, "16.2.6");
  assert.equal(packageJson.dependencies.react, "19.2.6");
  assert.match(nextConfig, /turbopack/);
  assert.match(nextConfig, /root: projectRoot/);
  assert.match(gitignore, /\/\.sanity\//);
  assert.match(gitignore, /!\.env\.example/);
  assert.match(pnpmWorkspace, /allowBuilds:\s+[\s\S]*esbuild: true/);
  assert.match(pnpmWorkspace, /sharp: true/);
  assert.match(pnpmWorkspace, /unrs-resolver: true/);
  await assert.rejects(readFile(new URL("package-lock.json", root), "utf8"));

  for (const removed of [
    "vinext",
    "vite",
    "wrangler",
    "drizzle-orm",
    "@cloudflare/vite-plugin",
  ]) {
    assert.equal(packageJson.dependencies[removed], undefined);
    assert.equal(packageJson.devDependencies[removed], undefined);
  }
});

test("keeps the public NaukriSetu shell without visitor authentication", async () => {
  const [portal, page, layout, sections, archive, detail, navigation] =
    await Promise.all([
      readFile(new URL("app/portal.tsx", root), "utf8"),
      readFile(new URL("app/page.tsx", root), "utf8"),
      readFile(new URL("app/layout.tsx", root), "utf8"),
      readFile(new URL("app/content.ts", root), "utf8"),
      readFile(new URL("app/[section]/page.tsx", root), "utf8"),
      readFile(new URL("app/notification/[slug]/page.tsx", root), "utf8"),
      readFile(new URL("app/components/main-navigation.tsx", root), "utf8"),
    ]);

  assert.match(portal, /NaukriSetu/);
  assert.doesNotMatch(portal, /type="email"/);
  assert.doesNotMatch(portal, /type="password"/);
  assert.doesNotMatch(portal, /Publisher console/);
  assert.doesNotMatch(portal, /Create free account/);
  assert.match(portal, /no account required/i);
  assert.match(portal, /MainNavigation/);
  assert.match(navigation, /notificationCategories\.map/);
  assert.match(navigation, /sectionMeta\[category\]\.shortTitle/);
  assert.match(navigation, /menu-toggle/);
  assert.match(page, /<Portal notifications=\{notifications\} \/>/);
  assert.match(layout, /Government Job Updates/);
  assert.match(sections, /answer-keys/);
  assert.match(sections, /scholarships/);
  assert.match(archive, /getNotifications/);
  assert.match(detail, /Important dates/);
  assert.match(detail, /Age limits/);
  assert.match(detail, /Eligibility/);
  assert.match(detail, /Important official links/);
  assert.match(detail, /getNotification/);
});

test("public pages use Sanity instead of hard-coded notification data", async () => {
  const [portal, sections, page, data, client] = await Promise.all([
    readFile(new URL("app/portal.tsx", root), "utf8"),
    readFile(new URL("app/content.ts", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("sanity/lib/data.ts", root), "utf8"),
    readFile(new URL("sanity/lib/client.ts", root), "utf8"),
  ]);

  assert.doesNotMatch(portal, /IBPS Clerk XVI Online Form 2026/);
  assert.doesNotMatch(portal, /const sections: Section\[\]/);
  assert.doesNotMatch(sections, /export const catalog/);
  assert.match(page, /getNotifications/);
  assert.match(data, /sanityClient\.fetch/);
  assert.doesNotMatch(client, /SANITY_API_(?:READ|WRITE)_TOKEN/);
  assert.match(client, /server-only/);
});

test("defines a complete seven-section Sanity notification schema", async () => {
  const [notification, organisation, breadcrumbs, queries] = await Promise.all([
    readFile(new URL("sanity/schemaTypes/notification.ts", root), "utf8"),
    readFile(new URL("sanity/schemaTypes/organisation.ts", root), "utf8"),
    readFile(new URL("sanity/lib/breadcrumbs.ts", root), "utf8"),
    readFile(new URL("sanity/lib/queries.ts", root), "utf8"),
  ]);

  for (const category of [
    "latest-jobs",
    "results",
    "admit-cards",
    "answer-keys",
    "syllabus",
    "admissions",
    "scholarships",
  ]) {
    assert.match(notification, new RegExp(category));
  }

  for (const field of [
    "updateMetadata",
    "importantDates",
    "applicationFees",
    "ageLimits",
    "eligibility",
    "vacancies",
    "instructions",
    "officialLinks",
    "faqs",
  ]) {
    assert.match(notification, new RegExp(`name: "${field}"`));
  }

  assert.match(organisation, /officialWebsite/);
  assert.match(breadcrumbs, /notificationBreadcrumbs/);
  assert.match(queries, /editorialStatus == "published"/);
});
