import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lando Studio | WebBuilder",
  description: "Advanced Web Builder for Lando Studio",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
