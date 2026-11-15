import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Henka — Sustainable businesses in Melbourne',
  description: 'Discover sustainable, ethical and planet-friendly businesses across Melbourne.',
  verification: {
    google: '6aQpV6f4a07WVYO02zZhh1WI2tTTmTtaxLqrtpLlb8g',
  },
  openGraph: {
    title: 'Henka — Sustainable businesses in Melbourne',
    description: 'Discover sustainable, ethical and planet-friendly businesses across Melbourne.',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Henka',
    locale: 'en_AU',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og?name=Henka&suburb=Melbourne&category=Sustainable%20businesses`,
        width: 1200,
        height: 630,
        alt: 'Henka - Sustainable businesses in Melbourne',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Henka — Sustainable businesses in Melbourne',
    description: 'Discover sustainable, ethical and planet-friendly businesses across Melbourne.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
