import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/store';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'CompetiHub | AIT Pune Student Competition & Certificate Platform',
  description:
    'Your Ideas. Your Achievements. Your Legacy. Central portal for Army Institute of Technology (AIT) Pune student competitions, podium finishes, verified projects, and principal-issued certificates.',
  keywords: ['AIT Pune', 'CompetiHub', 'student competitions', 'hackathon', 'certificates'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-[#080B14] text-[#F8FAFC] antialiased selection:bg-purple-600 selection:text-white font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
