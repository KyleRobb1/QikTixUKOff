import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "./components/shared/Navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dumfries & Galloway Explorer",
  description: "Discover the beauty and attractions of Dumfries & Galloway",
  keywords: ["Dumfries", "Galloway", "Scotland", "Tourism", "Travel", "Attractions", "Places", "Walks"],
  authors: [{ name: "D&G Explorer Team" }],
  openGraph: {
    title: "Dumfries & Galloway Explorer",
    description: "Discover the beauty and attractions of Dumfries & Galloway",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
