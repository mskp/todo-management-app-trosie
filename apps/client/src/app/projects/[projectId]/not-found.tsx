import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <MapPin className="h-24 w-24 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Project not found
        </h1>
        <p className="text-xl text-muted-foreground">
          Oops! The project you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-8" variant={'outline'}>
          <Link href="/projects">Return to Projects</Link>
        </Button>
      </div>
    </div>
  );
}
