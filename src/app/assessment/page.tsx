import { Suspense } from 'react';
import AssessmentClientPage from './client-page';

export default function AssessmentPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AssessmentClientPage />
    </Suspense>
  );
}

function LoadingState() {
    return (
        <div className="container mx-auto max-w-2xl py-12 px-4 md:py-20 text-center">
            <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
                Preparing your assessment...
            </h1>
        </div>
    )
}
