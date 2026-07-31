import type { Metadata } from "next";
import Portal from "./portal";
import { getNotifications } from "@/sanity/lib/data";

export const metadata: Metadata = {
  title: "NaukriSetu — Government Job Updates, Results & Admit Cards",
  description: "Fast, verified government job notifications, results, admit cards, answer keys and admissions in one place.",
};

export default async function Home() {
  const notifications = await getNotifications();
  return <Portal notifications={notifications} />;
}
