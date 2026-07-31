import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../components/site-header";
import { isNotificationCategory, notificationCategories, sectionMeta } from "../content";
import { getNotifications } from "@/sanity/lib/data";

function formatDate(value?: string) {
  return value
    ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value))
    : "Not specified";
}

export function generateStaticParams() {
  return notificationCategories.map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  if (!isNotificationCategory(section)) return {};
  const meta = sectionMeta[section];
  return { title: `${meta.title} — NaukriSetu`, description: meta.description };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isNotificationCategory(section)) notFound();
  const meta = sectionMeta[section];
  const items = (await getNotifications()).filter((item) => item.category === section);

  return <>
    <SiteHeader />
    <main className="archive-page">
      <div className="archive-hero"><span className="section-kicker">PUBLISHED UPDATES</span><h1>{meta.title}</h1><p>{meta.description}</p></div>
      <div className="archive-layout">
        <section className="archive-list">
          <header><b>{items.length} published notifications</b><span>Newest first</span></header>
          {items.map((item) => <article key={item._id}>
            <div><span className="archive-type">{meta.shortTitle}</span><h2><Link href={`/notification/${item.slug}`}>{item.title}</Link></h2>
              <p>{item.organisation?.name}</p><small>Updated {formatDate(item.updateMetadata?.updatedAt)}{item.updateMetadata?.updateLabel ? ` • ${item.updateMetadata.updateLabel}` : ""}</small>
            </div><Link className="open-notice" href={`/notification/${item.slug}`}>View details →</Link>
          </article>)}
          {items.length === 0 && <div className="empty-state">No published notifications in this section.</div>}
        </section>
        <aside className="archive-sidebar"><h2>Browse sections</h2>{notificationCategories.map((slug) => <Link className={slug === section ? "current" : ""} href={`/${slug}`} key={slug}>{sectionMeta[slug].title}<span>›</span></Link>)}
          <div className="source-note"><b>Official-source policy</b><p>We summarize official notices for convenience. Always confirm critical dates and eligibility on the linked authority website.</p></div>
        </aside>
      </div>
    </main>
  </>;
}
