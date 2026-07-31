"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { notificationCategories, sectionMeta } from "./content";
import type { NotificationListItem } from "@/sanity/lib/types";
import { MainNavigation } from "./components/main-navigation";

function formatDate(value?: string) {
  if (!value) return "Date not specified";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function Portal({ notifications }: { notifications: NotificationListItem[] }) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return notifications.filter((item) =>
      !value || `${item.title} ${item.organisation?.name ?? ""} ${item.organisation?.shortName ?? ""}`.toLowerCase().includes(value),
    );
  }, [notifications, query]);

  const homepageCategories = notificationCategories.slice(0, 3);
  const liveUpdates = notifications.slice(0, 3);

  return (
    <main>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="NaukriSetu home"><span className="brandmark">N</span><span>Naukri<span>Setu</span></span></Link>
        <MainNavigation />
        <Link className="signin" href="#jobs">Browse updates <span>→</span></Link>
      </header>

      <section className="hero" id="updates">
        <div className="orb one" /><div className="orb two" />
        <div className="hero-inner">
          <div className="eyebrow"><span>●</span> Verified official-source updates</div>
          <h1>India’s government job<br /><em>updates, made simple.</em></h1>
          <p>Jobs, results, admit cards and exam updates—everything you need in one public portal.</p>
          <form className="search" onSubmit={(event) => { event.preventDefault(); document.querySelector("#jobs")?.scrollIntoView({ behavior: "smooth" }); }}>
            <span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search jobs and exams" placeholder="Search jobs, exams, organisations..." /><button>Search</button>
          </form>
        </div>
        <div className="hero-card">
          <div className="card-head"><span className="live-dot" /> Recently added <small>{liveUpdates.length} shown</small></div>
          {liveUpdates.map((item) => {
            const meta = sectionMeta[item.category];
            return <article key={item._id}><span className={`mini-icon ${meta.color}`}>{meta.icon}</span><div><b>{item.title}</b><small>{meta.shortTitle} • {formatDate(item.updateMetadata?.updatedAt)}</small></div><Link aria-label={`Open ${item.title}`} href={`/notification/${item.slug}`}>→</Link></article>;
          })}
          {liveUpdates.length === 0 && <div className="empty-state">No published notifications yet.</div>}
          <div className="verified">✓ Published records are added recently</div>
        </div>
      </section>

      <section className="quick-wrap"><div className="quick-grid">
        {notificationCategories.map((category) => {
          const meta = sectionMeta[category];
          const count = notifications.filter((item) => item.category === category).length;
          return <Link key={category} className="quick-card" href={`/${category}`}><span className={`quick-icon ${meta.color}`}>{meta.icon}</span><span><b>{meta.shortTitle}</b><small>{count} published</small></span><i>›</i></Link>;
        })}
      </div></section>

      <section className="listing" id="jobs">
        <div className="listing-title"><div><h2>Latest updates</h2><p>{filtered.length} published notifications</p></div><span className="refresh">Newest first</span></div>
        <div className="columns">
          {homepageCategories.map((category) => {
            const meta = sectionMeta[category];
            const items = filtered.filter((item) => item.category === category);
            const visible = showAll[category] ? items : items.slice(0, 5);
            return <section className="notice-column" key={category}>
              <header><span className={`section-icon ${meta.color}`}>{meta.icon}</span><div><h3>{meta.shortTitle}</h3><small>{items.length} published</small></div><Link href={`/${category}`}>View all →</Link></header>
              {visible.map((item) => <article className="notice" key={item._id}><div>{item.updateMetadata?.updateLabel && <span className="tag">{item.updateMetadata.updateLabel}</span>}<h4><Link href={`/notification/${item.slug}`}>{item.title}</Link></h4><p>{item.organisation?.shortName || item.organisation?.name}</p><small>◷ {formatDate(item.updateMetadata?.updatedAt)}</small></div></article>)}
              {items.length === 0 && <div className="empty-state">No matching published notifications.</div>}
              {items.length > 5 && <button className="load-more" onClick={() => setShowAll((value) => ({ ...value, [category]: !value[category] }))}>{showAll[category] ? "Show less" : `Show all ${meta.shortTitle.toLowerCase()}`} <span>→</span></button>}
            </section>;
          })}
        </div>
      </section>

      <section className="trust"><div><span className="shield">✓</span><div><h2>Official links stay attached to every update.</h2><p>Critical dates and eligibility should always be confirmed on the responsible organisation’s linked website.</p></div></div><div className="stats"><span><b>{notifications.length}</b><small>Published updates</small></span><span><b>{notificationCategories.length}</b><small>Sections</small></span><span><b>Free</b><small>No account required</small></span></div></section>
      <section className="cta"><div><span>✦</span><div><h2>All important updates in one place</h2><p>Browse every published notification without registration.</p></div></div><Link className="cta-link" href="/latest-jobs">Browse latest jobs →</Link></section>
      <footer><div className="brand foot-brand"><span className="brandmark">N</span><span>Naukri<span>Setu</span></span></div><p>Independent information portal. Always verify details on the linked official website.</p><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div><small>© 2026 NaukriSetu. Not affiliated with any government organisation.</small></footer>
    </main>
  );
}
