import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";
import "@/styles/main.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuthApp",
  description: "A simple and secure way to manage your 2FA tokens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>{children}</body>
    </html>
  );
}
