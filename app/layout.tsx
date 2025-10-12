import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { I18nProvider } from '@/lib/i18n/context'
import { OfflineBanner } from '@/components/ui/OfflineBanner'
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "QuickQuote AI | Construction Estimating",
  description: "Lightning-fast construction estimates powered by AI. Professional estimating for contractors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <I18nProvider>
          <OfflineBanner />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
