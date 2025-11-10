import { Suspense } from 'react';
import AdminClientPage from './client-page';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AdminClientPage />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20 space-y-8">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
