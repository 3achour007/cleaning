import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Font imports
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate metadata dynamically based on the language
export async function generateMetadata({ params }: { params: { lang: string } }) {
  const metadata = {
    en: {
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
        url: "https://www.elitecleaning.com/en",
        siteName: "Elite Cleaning",
        images: [
          {
            url: "https://www.elitecleaning.com/images/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Elite Cleaning - Eco-Friendly Cleaning Services in Quebec",
          },
        ],
        locale: "en_CA",
        type: "website",
      },
      alternates: {
        canonical: "https://www.elitecleaning.com/en",
        languages: {
          fr: "https://www.elitecleaning.com/fr",
        },
      },
    },
    fr: {
      title: "Services de Nettoyage Écologiques au Québec | Elite Cleaning",
      description:
        "Services de nettoyage professionnels et abordables au Québec. Nous utilisons des produits de nettoyage 100% biosourcés pour les domiciles et les bureaux. Desservons Montréal, Québec, Laval et plus encore. Réservez dès maintenant pour un espace plus propre et plus sain!",
      keywords: [
        "nettoyage écologique",
        "services de nettoyage Québec",
        "nettoyage biosourcé",
        "nettoyage de bureau",
        "nettoyage résidentiel",
        "solutions de nettoyage vertes",
        "services de nettoyage abordables",
        "services de nettoyage Montréal",
        "services de nettoyage Québec",
        "services de nettoyage Laval",
        "services de nettoyage Gatineau",
        "services de nettoyage Sherbrooke",
        "services de nettoyage Longueuil",
      ],
      openGraph: {
        title: "Services de Nettoyage Écologiques au Québec | Elite Cleaning",
        description:
          "Services de nettoyage professionnels et abordables au Québec. Nous utilisons des produits de nettoyage 100% biosourcés pour les domiciles et les bureaux. Desservons Montréal, Québec, Laval et plus encore. Réservez dès maintenant pour un espace plus propre et plus sain!",
        url: "https://www.elitecleaning.com/fr",
        siteName: "Elite Cleaning",
        images: [
          {
            url: "https://www.elitecleaning.com/images/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Elite Cleaning - Services de Nettoyage Écologiques au Québec",
          },
        ],
        locale: "fr_CA",
        type: "website",
      },
      alternates: {
        canonical: "https://www.elitecleaning.com/fr",
        languages: {
          en: "https://www.elitecleaning.com/en",
        },
      },
    },
  };

  return metadata[params.lang] || metadata.en; // Return metadata based on language
}

export default function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Elite Cleaning",
    image: "https://www.elitecleaning.com/images/logo.jpg",
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
    url: `https://www.elitecleaning.com/${lang}`,
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
      "https://www.facebook.com/elitecleaning",
      "https://www.instagram.com/elitecleaning",
      "https://www.linkedin.com/company/elitecleaning",
    ],
  };

  return (
    <html lang={lang}>
      <head>
        {/* Add the JSON-LD script to the <head> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Add hreflang tags for SEO */}
        <link rel="alternate" hrefLang="en" href="https://www.elitecleaning.com/en" />
        <link rel="alternate" hrefLang="fr" href="https://www.elitecleaning.com/fr" />
        <link rel="alternate" hrefLang="x-default" href="https://www.elitecleaning.com" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
