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
    default: 'Amelia - Asistente de terapia con IA',
    template: '%s • Amelia',
  },
  description:
    'Asistente de terapia impulsado por IA y panel de insights para psicólogos y pacientes.',
  keywords: [
    'Amelia',
    'terapia',
    'salud mental',
    'psicología',
    'asistente IA',
    'panel de control',
  ],
  authors: [{ name: 'Equipo Amelia' }],
  creator: 'Equipo Amelia',
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
    <html lang="es" className={poppins.variable}>
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
