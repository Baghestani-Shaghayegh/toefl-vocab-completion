import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lexivo — TOEFL Reading Practice",
  description: "Practice TOEFL reading with fill-in-the-blank vocabulary exercises. Build your academic vocabulary, track progress, and prepare for the TOEFL exam for free.",
  keywords: "TOEFL reading practice, TOEFL vocabulary, TOEFL preparation, English vocabulary practice, academic English",
  metadataBase: new URL("https://lexivo.io"),
  openGraph: {
    title: "Lexivo — TOEFL Reading Practice",
    description: "Practice TOEFL reading with fill-in-the-blank exercises. Free vocabulary drills for TOEFL preparation.",
    url: "https://lexivo.io",
    siteName: "Lexivo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lexivo — TOEFL Reading Practice",
    description: "Free TOEFL reading vocabulary practice with instant feedback.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lexivo.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}