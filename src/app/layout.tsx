import type { Metadata, Viewport } from "next";
import { Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAFA",
};

export const metadata: Metadata = {
  title: "OMISSION - Record what you didn't give into.",
  description: "A minimalist tool for recording restraint. No accounts, no history.",
  openGraph: {
    title: "OMISSION",
    description: "Record what you didn't give into.",
    type: "website",
    locale: "en_US",
    siteName: "OMISSION",
  },
  twitter: {
    card: "summary_large_image",
    title: "OMISSION",
    description: "Record what you didn't give into.",
  },
  applicationName: "OMISSION",
  authors: [{ name: "OMISSION" }],
  keywords: ["restraint", "minimalist", "record", "log", "omission"],
  metadataBase: new URL("https://omission.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "OMISSION",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "description": "A minimalist tool for recording restraint.",
              "url": "https://omission.vercel.app", // Conceptual URL
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }),
          }}
        />
      </head>
      <body className={`${serif.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
