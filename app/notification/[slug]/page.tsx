import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../components/site-header";
import { sectionMeta } from "../../content";
import { getNotification } from "@/sanity/lib/data";
import { notificationBreadcrumbs } from "@/sanity/lib/breadcrumbs";

function formatDate(value?: string) {
  return value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Not specified";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = await getNotification((await params).slug);
  if (!item) return {};
  return {
    title: item.seo?.title || `${item.title} — NaukriSetu`,
    description: item.seo?.description || item.shortInformation,
    robots: item.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function NotificationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = await getNotification((await params).slug);
  if (!item) notFound();
  const meta = sectionMeta[item.category];
  const breadcrumbs = notificationBreadcrumbs(item);

  return (
    <>
      <SiteHeader />
      <main className="detail-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href}>
              {index > 0 && <span> › </span>}
              {index < breadcrumbs.length - 1 ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                crumb.label
              )}
            </span>
          ))}
        </nav>
        <article className="detail-card">
          <header className="detail-heading">
            <span className="archive-type">{meta.title}</span>
            <h1>{item.title}</h1>
            <p>{item.organisation?.name}</p>
            <div>
              <span>Updated {formatDate(item.updateMetadata?.updatedAt)}</span>
              {item.updateMetadata?.updateLabel && (
                <span className="status-pill">
                  ● {item.updateMetadata.updateLabel}
                </span>
              )}
            </div>
          </header>
          <section className="summary-box">
            <h2>Short information</h2>
            <p>{item.shortInformation}</p>
          </section>

          <div className="detail-grid">
            <section>
              <h2>Important dates</h2>
              <dl>
                {item.importantDates?.map((date) => (
                  <div key={date._key}>
                    <dt>{date.label}</dt>
                    <dd>
                      {date.date ? formatDate(date.date) : date.displayText}
                      {date.isTentative ? " (tentative)" : ""}
                      {date.note ? ` — ${date.note}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
              {!item.importantDates?.length && <p>Not specified.</p>}
            </section>
            <section>
              <h2>Application fees</h2>
              <dl>
                {item.applicationFees?.map((fee) => (
                  <div key={fee._key}>
                    <dt>{fee.category}</dt>
                    <dd>
                      {fee.amount === 0
                        ? "No fee"
                        : `₹${fee.amount.toLocaleString("en-IN")}`}
                      {fee.note ? ` — ${fee.note}` : ""}
                    </dd>
                  </div>
                ))}
                {item.feePaymentMethods?.length > 0 && (
                  <div>
                    <dt>Payment methods</dt>
                    <dd>{item.feePaymentMethods.join(", ")}</dd>
                  </div>
                )}
              </dl>
              {!item.applicationFees?.length && (
                <p>No application fee specified.</p>
              )}
            </section>
          </div>

          <section className="detail-section">
            <h2>Age limits</h2>
            {item.ageLimits?.length ? (
              <div className="info-table">
                <div className="table-row head">
                  <span>Rule / post</span>
                  <span>Details</span>
                </div>
                {item.ageLimits.map((age) => (
                  <div className="table-row" key={age._key}>
                    <span>{age.label}</span>
                    <span>
                      {age.minimumYears != null
                        ? `Minimum ${age.minimumYears} years. `
                        : ""}
                      {age.maximumYears != null
                        ? `Maximum ${age.maximumYears} years. `
                        : ""}
                      {age.calculatedOn
                        ? `Calculated on ${formatDate(age.calculatedOn)}. `
                        : ""}
                      {age.relaxation}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Refer to the official notice for applicable age rules.</p>
            )}
          </section>

          <section className="detail-section">
            <h2>Eligibility</h2>
            <div className="info-table">
              <div className="table-row head">
                <span>Requirement</span>
                <span>Details</span>
              </div>
              {item.eligibility?.map((rule) => (
                <div className="table-row" key={rule._key}>
                  <span>{rule.title}</span>
                  <span>{rule.details}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <h2>Vacancy / post details</h2>
            {item.vacancies?.length ? (
              <div className="info-table three">
                <div className="table-row head">
                  <span>Post / course</span>
                  <span>Total</span>
                  <span>Eligibility / pay</span>
                </div>
                {item.vacancies.map((vacancy) => (
                  <div className="table-row" key={vacancy._key}>
                    <span>{vacancy.postName}</span>
                    <span>
                      {vacancy.totalPosts ??
                        vacancy.totalDisplay ??
                        "Not specified"}
                    </span>
                    <span>
                      {[vacancy.eligibilitySummary, vacancy.payScale]
                        .filter(Boolean)
                        .join(" • ") || "See official notice"}
                      {vacancy.categoryBreakdown?.length
                        ? ` • ${vacancy.categoryBreakdown.map((row) => `${row.category}: ${row.posts}`).join(", ")}`
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No vacancy table applies to this update.</p>
            )}
          </section>

          <section className="detail-section">
            <h2>
              {item.instructionsTitle || "How to apply or check the update"}
            </h2>
            <ol className="steps">
              {item.instructions?.map((step) => (
                <li key={step._key}>
                  <b>{step.title}:</b> {step.details}
                </li>
              ))}
            </ol>
          </section>

          <section className="official-links">
            <h2>Important official links</h2>
            {item.officialLinks?.map((link) => (
              <div key={link._key}>
                <span>
                  {link.label}
                  {link.note ? ` — ${link.note}` : ""}
                </span>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  Open official link ↗
                </a>
              </div>
            ))}
          </section>

          {item.faqs?.length > 0 && (
            <section className="detail-section faq" id="faqs">
              <h2>Frequently asked questions</h2>
              {item.faqs.map((faq) => (
                <details key={faq._key}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </section>
          )}
        </article>
      </main>
    </>
  );
}
