import type React from 'react';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/libraries/react-query';
import { AuthProvider } from '@/contexts/auth-context';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  applicationName: 'Amelia',
  title: {
    default: 'Amelia - AI Therapy Assistant',
    template: '%s • Amelia',
  },
  description:
    'AI-powered therapy assistant and insights dashboard for psychologists and patients.',
  keywords: ['Amelia', 'therapy', 'mental health', 'psychology', 'AI assistant', 'dashboard'],
  authors: [{ name: 'Amelia Team' }],
  creator: 'Amelia Team',
  publisher: 'Amelia',
  generator: 'nextjs',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/logo.png' }],
    shortcut: ['/favicon.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
