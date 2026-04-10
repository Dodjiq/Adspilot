import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'AdsPilot — Plateforme Pub Meta pour E-commerce Africain | Templates & Analytics',
  description: '+500 templates publicitaires optimisés pour l\'Afrique. Créez et lancez vos campagnes Meta (Facebook/Instagram) en 5 minutes. Connexion Shopify, édition Canva, analytics ROAS. Essai gratuit.',
  keywords: [
    'publicité facebook afrique',
    'templates pub meta',
    'e-commerce africain',
    'campagnes facebook instagram',
    'shopify afrique',
    'canva templates',
    'ads meta afrique',
    'publicité digitale afrique',
    'templates beauté mode food',
    'ROAS analytics',
    'pub senegal cote ivoire nigeria',
    'marketing digital afrique'
  ],
  authors: [{ name: 'AdsPilot' }],
  creator: 'AdsPilot',
  publisher: 'AdsPilot',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: { 
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://ads-pilot.app',
    siteName: 'AdsPilot',
    title: 'AdsPilot — Créez des Pubs qui Convertissent pour l\'Afrique',
    description: '+500 templates publicitaires optimisés pour le marché africain. Lancez vos campagnes Meta en 5 minutes avec Shopify, Canva et Analytics intégrés.',
    images: [
      {
        url: 'https://ads-pilot.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AdsPilot - Plateforme Pub Meta pour E-commerce Africain',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdsPilot — Plateforme Pub Meta pour E-commerce Africain',
    description: '+500 templates optimisés Afrique. Lancez vos campagnes Meta en 5 min. Shopify + Canva + Analytics.',
    images: ['https://ads-pilot.app/twitter-image.png'],
    creator: '@adspilot',
  },
  alternates: {
    canonical: 'https://ads-pilot.app',
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AdsPilot',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '9.99',
      priceCurrency: 'EUR',
      priceValidUntil: '2026-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '500',
    },
    description: '+500 templates publicitaires optimisés pour l\'Afrique. Créez et lancez vos campagnes Meta en 5 minutes.',
    url: 'https://ads-pilot.app',
    image: 'https://ads-pilot.app/og-image.png',
    author: {
      '@type': 'Organization',
      name: 'AdsPilot',
      url: 'https://ads-pilot.app',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AdsPilot',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ads-pilot.app/logo.png',
      },
    },
  };

  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Onest:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
