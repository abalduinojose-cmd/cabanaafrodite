import type { Metadata, Viewport } from "next";
import { Allura, Bricolage_Grotesque, Instrument_Serif, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { MotionProvider } from "@/components/ui/MotionProvider";
import { AMENITIES, CONTACT, GEO, SITE } from "@/data/content";
import "./globals.css";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
  variable: "--font-display-next",
});

const bodyFont = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
  variable: "--font-body-next",
});

/** Assinatura "Afrodite" do logo. */
const scriptFont = Allura({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
  variable: "--font-script-next",
});

/** Serifa do "CABANA" do logo e das frases poéticas. */
const serifFont = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
  variable: "--font-serif-next",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [{ url: "/og.jpg", alt: SITE.ogAlt }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#17110b",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  image: [`${SITE.url}/og.jpg`],
  priceRange: "$$",
  currenciesAccepted: "BRL",
  address: {
    "@type": "PostalAddress",
    addressLocality: GEO.locality,
    addressRegion: GEO.region,
    addressCountry: GEO.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: GEO.latitude,
    longitude: GEO.longitude,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: CONTACT.rating,
    reviewCount: CONTACT.reviewCount,
    bestRating: 5,
    worstRating: 1,
  },
  amenityFeature: AMENITIES.groups.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: item.label,
      value: true,
    })),
  ),
  numberOfRooms: 1,
  occupancy: { "@type": "QuantitativeValue", maxValue: 4, unitText: "hóspedes" },
  petsAllowed: false,
  smokingAllowed: false,
  sameAs: [CONTACT.instagram, CONTACT.airbnb],
} as const;

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${displayFont.variable} ${bodyFont.variable} ${scriptFont.variable} ${serifFont.variable}`}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
        <script
          type="application/ld+json"
          // Conteúdo estático gerado a partir de content.ts, sem entrada do usuário.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
