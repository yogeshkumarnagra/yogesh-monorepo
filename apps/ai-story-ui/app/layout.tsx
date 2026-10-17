import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Story Pipeline",
  description: "Generate stories, images, audio and upload to YouTube - 100% Free",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
