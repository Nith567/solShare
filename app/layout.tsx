import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SelectedWalletAccountProvider } from "@/solana/context/SelectedWalletAccountContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "sonner";

// These styles apply to every route in the application
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solshare",
  description: "A platform for creators to monetize their content with pay on solana",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased w-dvw h-dvh text-black dark:text-white bg-gradient-to-br from-[#f8faff] via-[#e0ecff] to-[#dceeff] dark:from-[#0e0e12] dark:via-[#15161d] dark:to-[#101015]`}
    >
      <Toaster richColors position="top-center" />
      <ThemeProvider defaultTheme="system">
        <SelectedWalletAccountProvider>
          <header className="backdrop-blur-sm bg-white/70 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800 px-6 py-4 shadow-sm sticky top-0 z-50 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-[#2E74FF] dark:text-white">
              Solshare 🚀
            </Link>
            <div className="flex gap-4 items-center">
              <ThemeToggle />
              <Link
                href="/"
                className="bg-[#2E74FF] hover:bg-[#2361DB] text-white px-4 py-2 rounded-full font-medium transition"
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className="bg-[#2E74FF] hover:bg-[#2361DB] text-white px-4 py-2 rounded-full font-medium transition"
              >
                Marketplace
              </Link>
            </div>
          </header>

          <main className="p-4 md:p-8">{children}</main>
        </SelectedWalletAccountProvider>
      </ThemeProvider>
    </body>
  </html>
  );
}
