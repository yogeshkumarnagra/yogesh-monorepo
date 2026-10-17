import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yogesh Kumar | Frontend Engineer",
  description:
    "Senior Frontend Engineer specialising in Next.js, React, and TypeScript. Building for 100M+ users at Airtel Payments Bank.",
  keywords: [
    "Frontend Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Airtel Payments Bank",
    "SDE II",
    "Yogesh Kumar",
  ],
  authors: [{ name: "Yogesh Kumar" }],
  openGraph: {
    title: "Yogesh Kumar | Frontend Engineer",
    description:
      "SDE II at Airtel Payments Bank. Next.js · React · TypeScript · 100M+ MTU platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
