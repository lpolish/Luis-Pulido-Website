import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Josefin_Sans } from 'next/font/google'
import localFont from "next/font/local";
import "./globals.css";
import RotatingFavicon from "@/components/rotating-favicon";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const josefinSans = Josefin_Sans({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  style: 'normal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Luis Pulido Díaz Web and Software Engineering",
  description: "Create your next web application with Luis Pulido Díaz, a web and software engineer with over 10 years of experience in the industry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <RotatingFavicon />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${josefinSans.className} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
