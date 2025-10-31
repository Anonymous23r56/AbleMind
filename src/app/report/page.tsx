import { Suspense } from 'react';
import ReportClientPage from './client-page';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ReportClientPage />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20 space-y-8">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <div className="flex justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-8 pt-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    </div>
  );
}
