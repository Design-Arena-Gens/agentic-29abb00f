import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "MBTI Personality Quiz | Design Arena",
  description:
    "A 12-question MBTI-inspired personality quiz with tailored insights on strengths, growth edges, and collaboration tips.",
  openGraph: {
    title: "MBTI Personality Quiz",
    description:
      "Discover your MBTI personality type and unlock a tailored profile with strengths, growth edges, and collaboration insights.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MBTI Personality Quiz",
    description:
      "Discover your MBTI personality type and unlock a tailored profile with strengths, growth edges, and collaboration insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
