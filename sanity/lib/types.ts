export type NotificationCategory =
  | "latest-jobs"
  | "results"
  | "admit-cards"
  | "answer-keys"
  | "syllabus"
  | "admissions"
  | "scholarships";

export type Organisation = {
  name: string;
  shortName?: string;
  governmentLevel?: string;
  officialWebsite?: string;
};

export type NotificationListItem = {
  _id: string;
  title: string;
  slug: string;
  category: NotificationCategory;
  organisation: Organisation;
  updateMetadata: {
    referenceNumber?: string;
    updateLabel?: string;
    publishedAt: string;
    updatedAt: string;
    sourceVerified: boolean;
  };
  shortInformation: string;
  featured?: boolean;
};

export type NotificationDetail = NotificationListItem & {
  importantDates: Array<{ _key: string; label: string; date?: string; displayText?: string; isTentative?: boolean; note?: string }>;
  applicationFees: Array<{ _key: string; category: string; amount: number; note?: string }>;
  feePaymentMethods: string[];
  ageLimits: Array<{ _key: string; label: string; minimumYears?: number; maximumYears?: number; calculatedOn?: string; relaxation?: string }>;
  eligibility: Array<{ _key: string; title: string; details: string }>;
  vacancies: Array<{ _key: string; postName: string; totalPosts?: number; totalDisplay?: string; eligibilitySummary?: string; payScale?: string; categoryBreakdown?: Array<{ _key: string; category: string; posts: number }> }>;
  instructionsTitle: string;
  instructions: Array<{ _key: string; title: string; details: string }>;
  officialLinks: Array<{ _key: string; label: string; linkType: string; url: string; note?: string }>;
  faqs: Array<{ _key: string; question: string; answer: string }>;
  seo?: { title?: string; description?: string; noIndex?: boolean };
};
