'use client';

import { useRouter } from 'next/navigation';
import {
  useFirestore,
  useUser,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Session } from '@/lib/entities';
import { Loader2, Sparkles, ShieldAlert, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function DashboardClientPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const sessionsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'sessions'),
      orderBy('startTime', 'desc')
    );
  }, [firestore, user]);

  const {
    data: sessions,
    isLoading: isSessionsLoading,
    error,
  } = useCollection<Session>(sessionsQuery);

  if (isUserLoading || isSessionsLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  if (error) {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20 text-center">
            <h2 className="text-2xl font-semibold text-destructive">An error occurred</h2>
            <p className="text-muted-foreground mt-2">{error.message}</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20">
      <div className="space-y-4 mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Your Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Review your past cognitive assessment results and track your progress.
        </p>
      </div>

      {sessions && sessions.length > 0 ? (
        <div className="space-y-8">
          {sessions.map((session) => (
            <Card key={session.id} className="animate-fade-in">
              <CardHeader className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="md:col-span-2 space-y-1.5">
                    <CardTitle className="font-headline text-2xl">
                        Assessment Report
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(session.startTime), "MMMM d, yyyy 'at' h:mm a")}
                    </CardDescription>
                 </div>
                 <div className="flex md:justify-end items-start">
                    <div className="text-center">
                        <p className="font-headline text-4xl font-bold text-primary">{session.humanAiBalanceScore}</p>
                        <p className="text-xs text-muted-foreground font-medium tracking-wide">BALANCE SCORE</p>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg"><Sparkles className="h-5 w-5 text-accent"/>Strengths</h3>
                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                        {session.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg"><ShieldAlert className="h-5 w-5 text-destructive"/>Areas for Growth</h3>
                     <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                        {session.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 rounded-b-lg">
                 <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4"/>Personalized Insights</h4>
                    <p className="text-sm text-muted-foreground">{session.insights}</p>
                 </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No assessments found.</h2>
          <p className="text-muted-foreground mt-2">
            Complete an assessment to see your results here.
          </p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Start a New Assessment
          </Button>
        </div>
      )}
    </div>
  );
}
