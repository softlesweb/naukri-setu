/**
 * Projections keep the public app read-only and expose only fields needed by a
 * page. Drafts and records that have not passed the editorial workflow are
 * intentionally excluded.
 */
export const notificationListQuery = `*[
  _type == "notification" &&
  editorialStatus == "published"
] | order(updateMetadata.updatedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "organisation": organisation->{
    name,
    shortName,
    governmentLevel
  },
  updateMetadata,
  shortInformation,
  featured
}`;

export const notificationSlugsQuery = `*[
  _type == "notification" &&
  editorialStatus == "published" &&
  defined(slug.current)
]{"slug": slug.current}`;

export const notificationDetailQuery = `*[
  _type == "notification" &&
  editorialStatus == "published" &&
  slug.current == $slug
][0] {
  _id,
  title,
  "slug": slug.current,
  category,
  organisation->{
    name,
    shortName,
    governmentLevel,
    officialWebsite,
    logo
  },
  updateMetadata,
  shortInformation,
  importantDates,
  applicationFees,
  feePaymentMethods,
  ageLimits,
  eligibility,
  vacancies,
  instructionsTitle,
  instructions,
  officialLinks,
  faqs,
  seo
}`;
