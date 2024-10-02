'use client';

import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { Aubrey } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const aubrey = Aubrey({
  weight: '400',
  subsets: ['latin'],
});

export default function Navbar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled ? 'bg-white/70 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span
                className={`text-3xl !font-bold ${aubrey.className} bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600`}
              >
                {APP_NAME}
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  logout();
                }}
                variant="destructive"
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              >
                Logout
              </Button>
            ) : (
              <Button
                asChild
                variant="default"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
