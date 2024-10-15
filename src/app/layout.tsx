import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import MainContent from '@/components/MainContent';
import Mainpage from './page';
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
      <head>
        <link rel="icon" href="https://i.ibb.co/7Stn76P/lingolinc.png" sizes="any" /> {/* Link to your favicon */}
      </head>
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
