import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SnapCart AI — Your AI Shopping Co-Pilot",
  description:
    "Screenshot any product. Our AI instantly tells you if the deal is real, the reviews are legit, and whether you should buy.",
  keywords: ["AI shopping", "fake review detector", "deal analyzer", "product analysis"],
  openGraph: {
    title: "SnapCart AI — Your AI Shopping Co-Pilot",
    description: "Screenshot any product. AI tells you if it's worth it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
