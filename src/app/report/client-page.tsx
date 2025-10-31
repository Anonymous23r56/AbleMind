'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { InterpretUserResponsesOutput } from '@/ai/flows/interpret-user-responses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function ReportClientPage() {
  const router = useRouter();
  const [report, setReport] = useState<InterpretUserResponsesOutput | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const reportDataString = sessionStorage.getItem('ablemind-report');
    if (reportDataString) {
      try {
        const reportData = JSON.parse(reportDataString) as InterpretUserResponsesOutput;
        setReport(reportData);
        
        const strengthsCount = reportData.strengths.length;
        const weaknessesCount = reportData.weaknesses.length;
        const total = strengthsCount + weaknessesCount;
        const calculatedScore = total > 0 ? Math.round((strengthsCount / total) * 100) : 50;
        setScore(calculatedScore);

        // Don't remove the item, in case of a page refresh
        // sessionStorage.removeItem('ablemind-report'); 
      } catch (e) {
        // Data might be corrupted, redirect home
        console.error("Failed to parse report data", e);
        router.replace('/');
      }
    } else {
        // If no report data on initial load, it could be a redirect from assessment.
        // We'll wait a moment, but if it doesn't show up, they likely refreshed.
        const timer = setTimeout(() => {
          if (!sessionStorage.getItem('ablemind-report')) {
            router.replace('/');
          }
        }, 500); // Wait 500ms for session storage to populate on redirect
        return () => clearTimeout(timer);
    }
  }, [router]);
  
  if (!report) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Your Cognitive Report
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Here is a summary of your Human-AI Balance Score and cognitive profile.
        </p>
      </div>

      <div className="my-12 flex justify-center">
        <div className="relative h-48 w-48 rounded-full flex items-center justify-center bg-secondary">
          <div
            className="absolute top-0 left-0 w-full h-full rounded-full"
            style={{
              background: `conic-gradient(hsl(var(--primary)) ${score * 3.6}deg, hsl(var(--muted)) 0deg)`,
            }}
          ></div>
          <div className="relative h-40 w-40 rounded-full bg-background flex items-center justify-center flex-col">
            <span className="font-headline text-5xl font-bold text-primary">{score}</span>
            <span className="text-sm text-muted-foreground">Balance Score</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Sparkles className="h-6 w-6 text-accent" />
              Cognitive Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              Areas for Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-destructive flex-shrink-0"></div>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Lightbulb className="h-6 w-6 text-accent" />
              Personalized Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{report.insights}</p>
          </CardContent>
        </Card>

      <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <Button size="lg" onClick={() => router.push('/')}>
          <RotateCcw className="mr-2 h-5 w-5" />
          Take Assessment Again
        </Button>
      </div>
    </div>
  );
}
