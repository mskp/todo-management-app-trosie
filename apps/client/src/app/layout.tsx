import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { verifyAccessToken } from '@/lib/auth-utils';
import { APP_NAME } from '@/lib/constants';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${APP_NAME} - Powerful Todo Management with Project Organization`,
  description:
    'Trosie is your ultimate todo management solution, allowing you to create and manage projects, organize todos, and export project summaries directly to GitHub as gists. Stay on top of your tasks with ease and streamline your productivity.',
};

/**
 * Root layout of the application.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = await verifyAccessToken();
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Navbar isAuthenticated={isAuthenticated} />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
