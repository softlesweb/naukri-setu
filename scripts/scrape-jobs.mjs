/**
 * Scrapes job/notification listings from official government websites and
 * imports them into Sanity as DRAFT notifications for editorial review.
 *
 * Usage:
 *   pnpm scrape --dry-run            Print what would be imported, write nothing
 *   pnpm scrape                      Import new items as drafts (needs SANITY_API_WRITE_TOKEN)
 *   pnpm scrape --source=upsc,ibps   Only scrape the given sources
 *   pnpm scrape --limit=10           Cap items per source (default 25)
 *
 * By default imported documents are drafts (editorialStatus "draft",
 * sourceVerified false) awaiting editorial review; pass --publish to import
 * them as live published notifications instead.
 * Existing documents are never overwritten (createIfNotExists on a deterministic id).
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createClient } from "@sanity/client";

const execFileAsync = promisify(execFile);
const USER_AGENT =
  // Several government portals reject non-browser user agents outright.
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

// ---------------------------------------------------------------------------
// Source registry. Add a new government site by appending an entry here — the
// generic harvester below extracts recruitment-related links from any listing
// page. `pages` may list several URLs per organisation. Extra options per
// entry:
//   render: true       — load pages in headless Chromium (for JS-rendered
//                        notice boards; needs `pnpm exec playwright install chromium`)
//   fetchItems: fn     — bypass HTML harvesting entirely and return
//                        [{title, url}] from the site's own JSON API
// ---------------------------------------------------------------------------

/** SSC's notice board is an Angular SPA, but it is backed by a public JSON API. */
async function fetchSscNotices() {
  const query = new URLSearchParams({
    page: "1",
    limit: "50",
    contentType: "notice-boards",
    key: "createdAt",
    order: "DESC",
    pageType: "filter",
    isAttachment: "true",
    attributes: "id,headline,contentType,redirectUrl,createdAt",
    language: "english",
  });
  const response = await fetch(`https://ssc.gov.in/api/general-website/portal/records?${query}`, {
    headers: { "user-agent": USER_AGENT, accept: "application/json" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const { data } = await response.json();
  return (data ?? [])
    .map((row) => {
      const attachment = row.attachments?.[0]?.path;
      // Files are only served through the /api/attachment/ endpoint; the bare
      // uploads path returns the SPA shell with a client-side 404.
      const url =
        row.redirectUrl ||
        (attachment
          ? encodeURI(`https://ssc.gov.in/api/attachment/${attachment.replace(/\\/g, "/")}`)
          : null);
      return url ? { title: row.headline.trim(), url } : null;
    })
    .filter(Boolean);
}

const SOURCES = {
  upsc: {
    organisation: {
      name: "Union Public Service Commission",
      shortName: "UPSC",
      governmentLevel: "central",
      officialWebsite: "https://upsc.gov.in",
    },
    pages: [
      "https://upsc.gov.in/whats-new",
      "https://upsc.gov.in/examinations/active-examinations",
    ],
  },
  ssc: {
    organisation: {
      name: "Staff Selection Commission",
      shortName: "SSC",
      governmentLevel: "central",
      officialWebsite: "https://ssc.gov.in",
    },
    fetchItems: fetchSscNotices,
  },
  rrb: {
    organisation: {
      name: "Railway Recruitment Boards",
      shortName: "RRB",
      governmentLevel: "central",
      officialWebsite: "https://www.rrbapply.gov.in",
    },
    render: true,
    pages: ["https://www.rrbapply.gov.in/#/auth/landing"],
  },
  uppsc: {
    organisation: {
      name: "Uttar Pradesh Public Service Commission",
      shortName: "UPPSC",
      governmentLevel: "state",
      officialWebsite: "https://uppsc.up.nic.in",
    },
    // The homepage mixes server HTML with client-side Angular templates, so
    // it must be rendered to get real notice titles instead of {{...}} stubs.
    render: true,
    pages: ["https://uppsc.up.nic.in/"],
    // Open_PDF*.aspx links are bound to the visitor's session and redirect
    // everyone else to the homepage — link to the What's New listing instead.
    fixUrl: (url) =>
      /Open_PDF/i.test(url) ? "https://uppsc.up.nic.in/" : url,
  },
  ibps: {
    organisation: {
      name: "Institute of Banking Personnel Selection",
      shortName: "IBPS",
      governmentLevel: "central",
      officialWebsite: "https://www.ibps.in",
    },
    pages: ["https://www.ibps.in/"],
  },
  nta: {
    organisation: {
      name: "National Testing Agency",
      shortName: "NTA",
      governmentLevel: "central",
      officialWebsite: "https://nta.ac.in",
    },
    // The archive lists notices newest-first back to 2019 — only take the top.
    maxItems: 5,
    pages: ["https://nta.ac.in/NoticeBoardArchive"],
  },
  esic: {
    organisation: {
      name: "Employees' State Insurance Corporation",
      shortName: "ESIC",
      governmentLevel: "central",
      officialWebsite: "https://esic.gov.in",
    },
    pages: ["https://esic.gov.in/recruitments"],
  },
  bpsc: {
    organisation: {
      name: "Bihar Public Service Commission",
      shortName: "BPSC",
      governmentLevel: "state",
      officialWebsite: "https://bpsc.bihar.gov.in",
    },
    pages: ["https://bpsc.bihar.gov.in/whats-new/"],
  },
};

// Anchor text must contain at least one of these to count as a job update.
const RELEVANT = /recruit|vacanc|notification|advertis|apply|online form|examination|admit card|hall ticket|result|merit list|answer key|response sheet|syllabus|admission|counselling|scholarship|post of|engagement/i;
// Skip navigation chrome and non-notice links.
const IRRELEVANT = /^(home|about|contact|login|register|sitemap|faq|rti|tender|archive|gallery|feedback|disclaimer|privacy|terms|help)\b|dashboard/i;

const CATEGORY_RULES = [
  ["results", /result|merit list|cut ?off|score ?card|selection list|marks/i],
  ["admit-cards", /admit card|hall ticket|exam city|exam date|call letter|exam schedule/i],
  ["answer-keys", /answer key|response sheet|objection/i],
  ["syllabus", /syllabus|exam pattern/i],
  ["admissions", /admission|counselling|entrance/i],
  ["scholarships", /scholarship/i],
];

function classify(title) {
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(title)) return category;
  }
  return "latest-jobs";
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    clearTimeout(timer);
    // Many government sites serve incomplete TLS certificate chains that
    // Node's CA store rejects. System curl resolves the chain via the OS
    // keychain, so fall back to it before giving up.
    const { stdout } = await execFileAsync(
      "curl",
      ["-sSL", "--fail", "--max-time", "20", "-A", USER_AGENT, url],
      { maxBuffer: 20 * 1024 * 1024 },
    ).catch(() => {
      throw error; // report the original fetch failure
    });
    return stdout;
  } finally {
    clearTimeout(timer);
  }
}

/** Repair common URL defects found on government sites. */
function sanitizeUrl(url) {
  return encodeURI(
    url
      .replace(/^http:\/\/https?\/\//, "https://") // e.g. "http://https//nta.ac.in"
      .replace(/^http:/, "https:"),
  );
}

/**
 * Verify a link actually resolves (2xx) before it is imported. Uses curl so
 * sites with broken TLS chains behave the same as they do for real visitors.
 */
async function urlIsAlive(url) {
  try {
    const { stdout } = await execFileAsync(
      "curl",
      ["-skL", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "20", "--range", "0-1024", "-A", USER_AGENT, url],
      { maxBuffer: 1024 * 1024 },
    );
    const status = Number(stdout.trim());
    return status >= 200 && status < 400;
  } catch {
    return false;
  }
}

let browserPromise = null;

/** Render a JS-driven page in headless Chromium and return its final HTML. */
async function renderPage(url) {
  if (!browserPromise) {
    browserPromise = import("playwright")
      .then(({ chromium }) => chromium.launch({ headless: true }))
      .catch((error) => {
        throw new Error(
          `playwright unavailable (${error.message}). Run: pnpm exec playwright install chromium`,
        );
      });
  }
  const browser = await browserPromise;
  const page = await browser.newPage({ userAgent: USER_AGENT });
  try {
    // Skip heavy assets — only the DOM matters.
    await page.route("**/*", (route) =>
      ["image", "font", "media", "stylesheet"].includes(route.request().resourceType())
        ? route.abort()
        : route.continue(),
    );
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
    return await page.content();
  } finally {
    await page.close();
  }
}

/** Extract relevant {title, url} pairs from a listing page's anchors. */
function harvestLinks(html, pageUrl) {
  const items = [];
  const seen = new Set();
  const anchors = html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi);
  for (const [, href, inner] of anchors) {
    const title = decodeEntities(inner.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
    if (title.length < 20 || title.length > 200) continue;
    // Skip unrendered template stubs and leaked server-side markup.
    if (title.includes("{{") || title.includes("?>")) continue;
    if (!RELEVANT.test(title) || IRRELEVANT.test(title)) continue;
    if (/^(javascript|mailto|tel):/i.test(href)) continue;
    let url;
    try {
      url = new URL(href, pageUrl).href;
    } catch {
      continue;
    }
    if (!url.startsWith("http")) continue;
    const key = slugify(title);
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ title, url });
  }
  return items;
}

function buildDocuments(sourceKey, source, items, now, publish) {
  const orgId = `organisation-${sourceKey}`;
  const organisation = {
    _id: orgId,
    _type: "organisation",
    name: source.organisation.name,
    shortName: source.organisation.shortName,
    governmentLevel: source.organisation.governmentLevel,
    officialWebsite: source.organisation.officialWebsite,
  };

  const notifications = items.map(({ title, url }) => {
    const slug = slugify(`${source.organisation.shortName} ${title}`);
    const httpsUrl = url.replace(/^http:/, "https:");
    return {
      _id: `scraped-${slug}`,
      _type: "notification",
      title: title.slice(0, 160),
      slug: { current: slug },
      category: classify(title),
      organisation: { _type: "reference", _ref: orgId },
      updateMetadata: {
        updateLabel: "Imported from official site",
        publishedAt: now,
        updatedAt: now,
        sourceVerified: publish,
      },
      shortInformation: `${title}. Imported automatically from ${source.organisation.name} (${new URL(url).hostname}). Confirm critical dates and eligibility on the linked official notice.`,
      importantDates: [
        {
          _key: "seen",
          label: "Seen on official website",
          date: now.slice(0, 10),
          isTentative: true,
        },
      ],
      eligibility: [
        {
          _key: "official",
          title: "As per official notification",
          details: "Refer to the linked official notice for eligibility details. Pending editorial verification.",
        },
      ],
      instructionsTitle: "How to apply or check the update",
      instructions: [
        {
          _key: "open",
          title: "Open the official link",
          details: "Read the full notice on the organisation's website and follow the steps given there.",
        },
      ],
      officialLinks: [
        {
          _key: "source",
          label: "Official notice",
          linkType: "notification",
          url: httpsUrl,
        },
        {
          _key: "org",
          label: `${source.organisation.shortName} website`,
          linkType: "organisation",
          url: source.organisation.officialWebsite,
        },
      ],
      editorialStatus: publish ? "published" : "draft",
      featured: false,
    };
  });

  return { organisation, notifications };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
// --publish imports items as live published notifications instead of drafts.
const publish = args.includes("--publish");
const limit = Number(args.find((arg) => arg.startsWith("--limit="))?.split("=")[1]) || 25;
const only = args.find((arg) => arg.startsWith("--source="))?.split("=")[1]?.split(",");
const sourceEntries = Object.entries(SOURCES).filter(([key]) => !only || only.includes(key));

if (sourceEntries.length === 0) {
  console.error(`No matching sources. Available: ${Object.keys(SOURCES).join(", ")}`);
  process.exit(1);
}

let client = null;
if (!dryRun) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) {
    throw new Error(
      "NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN are required (or use --dry-run).",
    );
  }
  client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    token,
    apiVersion: "2026-07-31",
    useCdn: false,
  });
}

const now = new Date().toISOString();
let totalFound = 0;
let totalImported = 0;

const results = await Promise.allSettled(
  sourceEntries.map(async ([key, source]) => {
    const items = [];
    const seen = new Set();
    const push = (item) => {
      const slug = slugify(item.title);
      if (!seen.has(slug)) {
        seen.add(slug);
        items.push(item);
      }
    };
    if (source.fetchItems) {
      try {
        for (const item of await source.fetchItems()) push(item);
      } catch (error) {
        console.warn(`  ! ${key}: API fetch failed (${error.message})`);
      }
    }
    for (const page of source.pages ?? []) {
      try {
        const html = source.render ? await renderPage(page) : await fetchPage(page);
        for (const item of harvestLinks(html, page)) push(item);
      } catch (error) {
        console.warn(`  ! ${key}: failed to fetch ${page} (${error.message})`);
      }
    }
    const capped = items
      .slice(0, Math.min(limit, source.maxItems ?? limit))
      .map((item) => ({
        ...item,
        url: sanitizeUrl(source.fixUrl ? source.fixUrl(item.url) : item.url),
      }));
    // Drop items whose official link does not actually resolve.
    const checked = await Promise.all(
      capped.map(async (item) => ((await urlIsAlive(item.url)) ? item : null)),
    );
    const alive = checked.filter(Boolean);
    if (alive.length < capped.length) {
      console.warn(`  ! ${key}: dropped ${capped.length - alive.length} items with dead links`);
    }
    return [key, source, alive];
  }),
);

for (const result of results) {
  if (result.status === "rejected") {
    console.warn(`  ! source failed: ${result.reason?.message ?? result.reason}`);
    continue;
  }
  const [key, source, items] = result.value;
  totalFound += items.length;
  console.log(`\n${source.organisation.shortName} (${key}): ${items.length} relevant links`);
  for (const item of items) {
    console.log(`  [${classify(item.title)}] ${item.title}\n    ${item.url}`);
  }
  if (dryRun || items.length === 0) continue;

  const { organisation, notifications } = buildDocuments(key, source, items, now, publish);
  let transaction = client.transaction().createIfNotExists(organisation);
  for (const doc of notifications) transaction = transaction.createIfNotExists(doc);
  const committed = await transaction.commit();
  const created = committed.results.filter(
    (row) => row.operation === "create" && row.id !== organisation._id,
  ).length;
  totalImported += created;
  console.log(
    `  → imported ${created} new ${publish ? "published notifications" : "drafts"} (existing ones untouched)`,
  );
}

console.log(
  `\nDone. ${totalFound} relevant links found${dryRun ? " (dry run, nothing written)" : `, ${totalImported} new ${publish ? "published notifications" : "drafts"} imported`}.`,
);

if (browserPromise) {
  await browserPromise.then((browser) => browser.close()).catch(() => {});
}
