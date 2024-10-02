import { APP_NAME } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          <span className="font-medium">
            &copy; {currentYear} {APP_NAME}
          </span>
          <span className="mx-1.5">&bull;</span>
          <span>All rights reserved</span>
        </p>
      </div>
    </footer>
  );
}
