import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/query_provider";

const workSans = Work_Sans({
  variable: "--font-geist-sans",
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
