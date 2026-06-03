import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner/AnnouncementBanner";
import { getVerticalNames, getSiteConfig } from "@/lib/cms";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: "Zenquillient",
    description: "Your journey to mindfulness and mental wellbeing.",
    icons: {
      icon: siteConfig.logoUrl || "/favicon.ico",
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch live vertical names from Appwrite (server-side, on every request)
  const verticals = await getVerticalNames();
  const siteConfig = await getSiteConfig();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable}`}>
        <header style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
          <AnnouncementBanner />
          <Navbar verticals={verticals} logoUrl={siteConfig.logoUrl} />
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
