import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SITE_IMAGES } from "@/lib/siteImages";

const favicon = SITE_IMAGES.favicon;

export const metadata: Metadata = {
  metadataBase: new URL("https://alpacaa.in"),
  icons: {
    icon: favicon,
    shortcut: favicon,
    apple: favicon,
  },
  title: {
    default: "ALPACA | MADE FOR THE MOVE",
    template: "%s | ALPACA",
  },
  description:
    "Minimal, premium essentials for everyday movement. Explore ALPACA's oversized tees, refined basics, and new drops.",
  applicationName: "ALPACA",
  category: "fashion",
  keywords: [
    "ALPACA",
    "fashion essentials",
    "minimal fashion",
    "premium streetwear",
    "premium t-shirts",
    "t-shirts",
    "printed t-shirts",
    "oversized t-shirts",
    "made for the move",
  ],
  openGraph: {
    title: "ALPACA | MADE FOR THE MOVE",
    description:
      "Minimal, premium essentials for everyday movement. Oversized tees, elevated basics, and new drops in one clean storefront.",
    siteName: "ALPACA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ALPACA | MADE FOR THE MOVE",
    description:
      "Minimal, premium essentials for everyday movement. Oversized tees, elevated basics, and new drops in one clean storefront.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
