import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "bidserver.lol — 12 Finite Slots • King of the Hill Bidding Wars",
  description:
    "12 finite slots. The world's most contested 3D server rack. Hot-swap advertising for tech founders, developers, and startups.",
  metadataBase: new URL(
    "https://www.bidserver.lol"
  ),
  openGraph: {
    title: "bidserver.lol — The Global Tech Server Rack",
    description:
      "12 finite slots. Hot-swappable advertising on the world's most contested 3D server rack. Try to pull my plug!",
    url: "https://bidserver.lol",
    siteName: "bidserver.lol",
    images: [
      {
        url: "/api/og?slot=01&company=MASTER+NODE&bid=250.00",
        width: 1200,
        height: 630,
        alt: "The Global Tech Server Rack Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bidserver.lol — The Global Tech Server Rack",
    description:
      "12 finite slots. Hot-swap advertising for tech founders. Try to pull my plug!",
    images: ["/api/og?slot=01&company=MASTER+NODE&bid=250.00"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800;900&family=Outfit:wght@400;600;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#07070a] text-zinc-100 antialiased overflow-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
