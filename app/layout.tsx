import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

// Font imports
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define metadata for English
export const metadata = {
  title: "Eco-Friendly Cleaning Services in Quebec | Elite Cleaning",
  description:
    "Professional and affordable eco-friendly cleaning services in Quebec. We use 100% bio-based cleaning products for homes and offices. Serving Montreal, Quebec City, Laval, and more. Book now for a cleaner, healthier space!",
  keywords: [
    "eco-friendly cleaning",
    "cleaning services Quebec",
    "bio-based cleaning",
    "office cleaning",
    "residential cleaning",
    "green cleaning solutions",
    "affordable cleaning services",
    "Montreal cleaning services",
    "Quebec City cleaning services",
    "Laval cleaning services",
    "Gatineau cleaning services",
    "Sherbrooke cleaning services",
    "Longueuil cleaning services",
  ],
  openGraph: {
    title: "Eco-Friendly Cleaning Services in Quebec | Elite Cleaning",
    description:
      "Professional and affordable eco-friendly cleaning services in Quebec. We use 100% bio-based cleaning products for homes and offices. Serving Montreal, Quebec City, Laval, and more. Book now for a cleaner, healthier space!",
    url: "https://ecofriendlyclean.ca",
    siteName: "Eco Friendly Cleaning",
    images: [
      {
        url: "https://ecofriendlyclean.ca/images/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Elite Cleaning - Eco-Friendly Cleaning Services in Quebec",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  alternates: {
    canonical: "https://ecofriendlyclean.ca",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Eco Friendly Cleaning",
    image: "https://ecofriendlyclean.ca/images/logo.jpeg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "4745 Rue Sainte-Catherine E",
      addressLocality: "Montreal",
      postalCode: "H1V 1Z3",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "45.5017",
      longitude: "-73.5673",
    },
    url: "https://ecofriendlyclean.ca",
    telephone: "+1-438-408-2316",
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "16:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/profile.php?id=61571700223824&sk=about",
      "https://www.instagram.com/eco_friendly_cleaning_",
      "https://www.linkedin.com/company/elitcleaning",
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Add the JSON-LD script to the <head> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Favicon Links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}