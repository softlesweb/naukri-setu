import type { Metadata } from "next";
import "./styles/globals.css";
import "./styles/public-access.css";
import "./styles/typography.css";
import "./styles/responsive-layout.css";
import "./styles/navigation.css";
import "./styles/faq.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: "NaukriSetu — Government Job Updates",
  description:
    "Verified government jobs, results, admit cards, answer keys and admission alerts.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "NaukriSetu — Government Job Updates",
    description: "Government job updates, made simple.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "NaukriSetu government job updates",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
