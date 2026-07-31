import type { NotificationCategory } from "@/sanity/lib/types";

export const sectionMeta: Record<
  NotificationCategory,
  { title: string; shortTitle: string; description: string; icon: string; color: string }
> = {
  "latest-jobs": { title: "Latest Government Jobs", shortTitle: "Latest Jobs", description: "Recently announced central and state government recruitment forms.", icon: "◫", color: "indigo" },
  results: { title: "Exam Results", shortTitle: "Results", description: "Merit lists, score cards, final results and selection lists.", icon: "✓", color: "emerald" },
  "admit-cards": { title: "Admit Cards & Exam Dates", shortTitle: "Admit Cards", description: "Hall tickets, exam-city details, schedules and postponed notices.", icon: "▣", color: "amber" },
  "answer-keys": { title: "Answer Keys", shortTitle: "Answer Keys", description: "Provisional and final answer keys, response sheets and objection links.", icon: "⌁", color: "rose" },
  syllabus: { title: "Exam Syllabus", shortTitle: "Syllabus", description: "Official syllabus, exam pattern and subject-wise preparation details.", icon: "≡", color: "sky" },
  admissions: { title: "Admissions", shortTitle: "Admissions", description: "Entrance forms, counselling, registrations and university admissions.", icon: "♢", color: "violet" },
  scholarships: { title: "Scholarships", shortTitle: "Scholarships", description: "Fresh and renewal applications, status checks and student schemes.", icon: "☆", color: "orange" },
};

export const notificationCategories = Object.keys(
  sectionMeta,
) as NotificationCategory[];

export function isNotificationCategory(
  value: string,
): value is NotificationCategory {
  return value in sectionMeta;
}
