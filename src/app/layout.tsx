import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import { ReactQueryProvider } from "@/lib/query_provider";

import "./globals.css";

const workSans = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwitchDeals",
  description: "Find deals on eShop here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.className} antialiased`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
