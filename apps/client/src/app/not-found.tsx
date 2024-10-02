import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

/**
 * Renders the 404 not found page for the application
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <MapPin className="h-24 w-24 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Page Not Found
        </h1>
        <p className="text-xl text-muted-foreground">
          Oops! It seems {"you've"} wandered off the map. The page {"you're"} looking
          for {"doesn't"} exist or has been moved.
        </p>
        <Button asChild className="mt-8" variant={'outline'}>
          <Link href="/projects">Return to Projects</Link>
        </Button>
      </div>
    </div>
  );
}
