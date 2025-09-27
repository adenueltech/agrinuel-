import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://agrinuel.com'),
  title: {
    default: 'AgriNuel - Direct Farm-to-Consumer Agricultural Marketplace',
    template: '%s | AgriNuel'
  },
  description: 'Connect Nigerian farmers directly with buyers. Eliminate middlemen, increase farmer profits by 60%, and get fresh produce at better prices. Secure trading platform with logistics optimization.',
  keywords: [
    'agricultural marketplace',
    'Nigerian farmers',
    'direct farm sales',
    'fresh produce',
    'agritech Nigeria',
    'farmer marketplace',
    'agricultural logistics',
    'price tracking',
    'farm to consumer'
  ],
  authors: [{ name: 'AgriNuel Team' }],
  creator: 'adenueltech',
  publisher: 'AgriNuel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'agritech',
  classification: 'Agricultural Marketplace',
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
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://agrinuel.com',
    title: 'AgriNuel - Direct Farm-to-Consumer Agricultural Marketplace',
    description: 'Connect Nigerian farmers directly with buyers. Eliminate middlemen, increase farmer profits by 60%, and get fresh produce at better prices.',
    siteName: 'AgriNuel',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AgriNuel - Agricultural Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgriNuel - Direct Farm-to-Consumer Agricultural Marketplace',
    description: 'Connect Nigerian farmers directly with buyers. Eliminate middlemen, increase farmer profits by 60%, and get fresh produce at better prices.',
    images: ['/og-image.jpg'],
    creator: '@agrinuel',
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  alternates: {
    canonical: 'https://agrinuel.com',
  },
  other: {
    'theme-color': '#16a34a',
    'color-scheme': 'light dark',
    'twitter:site': '@agrinuel',
    'twitter:creator': '@adenueltech',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AgriNuel",
    "description": "Direct farm-to-consumer agricultural marketplace connecting Nigerian farmers with buyers",
    "url": "https://agrinuel.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "NGN"
    },
    "creator": {
      "@type": "Organization",
      "name": "AgriNuel",
      "url": "https://agrinuel.com"
    },
    "provider": {
      "@type": "Organization",
      "name": "adenueltech",
      "url": "https://github.com/adenueltech"
    },
    "featureList": [
      "Direct farmer-buyer connections",
      "Real-time price tracking",
      "Integrated logistics",
      "Quality assurance",
      "Secure payments"
    ],
    "screenshot": "/og-image.jpg"
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preload hero images for instant loading */}
        <link rel="preload" href="/hero1.png" as="image" type="image/png" />
        <link rel="preload" href="/hero2.png" as="image" type="image/png" />
        <link rel="preload" href="/hero3.png" as="image" type="image/png" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//rcojtrsbegadmoysisz.supabase.co" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
