'use client';

import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();
  return (
    <div className="container mx-auto flex h-[70vh] flex-col items-center justify-center text-center">
      <FileQuestion className="h-16 w-16 text-primary" />
      <h1 className="mt-8 font-headline text-4xl font-bold md:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button onClick={() => router.push('/')} className="mt-8">
        Go to Homepage
      </Button>
    </div>
  );
}
