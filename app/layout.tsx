import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

import AppShell from "@/components/layout/AppShell";

const Inter_Font = Inter({
  variable: "--fonr-inter",
  subsets: ["latin"]
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IssueForge | Create an account",
  description: "Create an IssueForge account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${Inter_Font.className} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
