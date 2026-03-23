import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://geteasycar.com"),
  title: {
    default: "Get Easy Car — Compare Car Rental Deals Worldwide",
    template: "%s | Get Easy Car",
  },
  description:
    "Find and compare car rental options across cities and airports worldwide. Discover travel guides and tips for renting cars abroad.",
  applicationName: "Get Easy Car",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://geteasycar.com/",
    siteName: "Get Easy Car",
    title: "Get Easy Car — Compare Car Rental Deals Worldwide",
    description:
      "Find and compare car rental options across cities and airports worldwide. Discover travel guides and tips for renting cars abroad.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Easy Car — Compare Car Rental Deals Worldwide",
    description:
      "Find and compare car rental options across cities and airports worldwide. Discover travel guides and tips for renting cars abroad.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}