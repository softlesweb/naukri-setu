import type { NotificationCategory } from "./types";

const sections = {
  "latest-jobs": "Latest Jobs",
  results: "Results",
  "admit-cards": "Admit Cards and Exam Dates",
  "answer-keys": "Answer Keys",
  syllabus: "Syllabus",
  admissions: "Admissions",
  scholarships: "Scholarships",
} as const;

export function notificationBreadcrumbs(notification: {
  category: NotificationCategory;
  slug: string;
  title: string;
}) {
  return [
    { label: "Home", href: "/" },
    {
      label: sections[notification.category],
      href: `/${notification.category}`,
    },
    {
      label: notification.title,
      href: `/notification/${notification.slug}`,
    },
  ];
}
