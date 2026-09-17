import React from "react";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
// @ts-expect-error Next.js serves global styles via the app router
import "./globals.css";
import { readDb } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const db = readDb();
  const seo = db.settings.seo;

  return {
    metadataBase: new URL("https://roadlenz.example.com"),
    title: {
      default: seo.title,
      template: `%s — RoadLenz`,
    },
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      type: "website",
      locale: "en_IN",
      siteName: db.settings.legalName,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RoadLenz Intelligent Mobility",
  legalName: "RoadLenz Intelligent Mobility",
  description:
    "Enterprise fleet intelligence, GPS tracking, video telematics and vehicle-safety technology, powered by Bigfox Engineering Private Limited.",
  parentOrganization: {
    "@type": "Organization",
    name: "Bigfox Engineering Private Limited",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  sameAs: [],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = readDb();
  const session = await getCurrentSession();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgJsonLd),
          }}
        />

        <CartProvider>
          <Header session={session} />

          <main className="flex-1">
            {children}
          </main>

          <Footer db={db} />
        </CartProvider>
      </body>
    </html>
  );
}