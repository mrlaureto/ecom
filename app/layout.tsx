import React, { Suspense } from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Make sure the path is correct
import Navbar from "./components/navigation/Navbar";
import Providers from "./redux/provider";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import Footer from "./components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SocialCultures - Trendsetting Fashion for the Modern Shopper",
  description: "Shop the latest trends in fashion at SocialCultures. Discover our wide range of swimwear, performance wear, and accessories. Enjoy seamless shopping with secure user authentication and a dynamic, interactive interface. Visit SocialCultures today and elevate your style."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            {children}
            <Footer />
          </Suspense>
        </Providers>
      </body>
    </html>
    </ClerkProvider>
  );
}
