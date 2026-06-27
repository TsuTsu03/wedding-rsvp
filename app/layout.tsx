import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { wedding } from "@/lib/content";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const title = `${wedding.couple.one} & ${wedding.couple.two}`;

export const metadata: Metadata = {
  title: `${title} - We're getting married`,
  description: wedding.invitation,
  openGraph: {
    title: `${title} - ${wedding.dateLabel}`,
    description: wedding.invitation,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        {/* Global film grain over the light interior (multiply). Dark chapters
            carry their own screen-blend grain. */}
        <div className="page-grain" aria-hidden />
      </body>
    </html>
  );
}
