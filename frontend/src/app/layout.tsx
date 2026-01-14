import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VerifyChain RWA | AI-Powered Real World Asset Tokenization",
  description: "Tokenize government bonds with AI verification, real-time oracle feeds, and proof-of-reserve on Celo blockchain. Built for institutional trust and retail accessibility.",
  keywords: ["RWA", "tokenization", "blockchain", "Celo", "bonds", "DeFi", "AI verification", "proof of reserve"],
  authors: [{ name: "VerifyChain Team" }],
  openGraph: {
    title: "VerifyChain RWA | Mathematically Verified Real World Assets",
    description: "Tokenize government bonds with AI-powered verification, live Yahoo Finance oracle feeds, and cryptographic proof-of-reserve on Celo. The institutional trust layer for RWA.",
    type: "website",
    locale: "en_US",
    siteName: "VerifyChain RWA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VerifyChain RWA - AI-Powered Bond Tokenization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VerifyChain RWA | AI-Powered Bond Tokenization",
    description: "Tokenize government bonds with cryptographic verification and proof-of-reserve on Celo blockchain.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
