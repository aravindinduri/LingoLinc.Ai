// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import MainContent from '@/components/MainContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LingoLinc',
  description: 'Learn with fun',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <MainContent />
      </body>
    </html>
  );
}
