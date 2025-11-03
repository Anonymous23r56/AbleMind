'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Briefcase, Paintbrush, User } from 'lucide-react';
import { useUser } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ContextOption = {
  id: 'Personal' | 'Work' | 'Creative';
  title: string;
  description: string;
  icon: React.ElementType;
};

const contextOptions: ContextOption[] = [
  {
    id: 'Personal',
    title: 'Personal',
    description: 'For everyday use (Chats, advice, self-improvement, or curiosity)',
    icon: User,
  },
  {
    id: 'Work',
    title: 'Work',
    description: 'For boosting productivity, research, writing, or problem solving at your job or business',
    icon: Briefcase,
  },
  {
    id: 'Creative',
    title: 'Creative',
    description: 'For ideas, design, storytelling or artistic expression with AI as your co-creator',
    icon: Paintbrush,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [selectedContext, setSelectedContext] = useState<string | null>(null);

  useEffect(() => {
    // After login, the user is redirected here.
    // Check if a context was saved before the login redirect.
    const savedContext = sessionStorage.getItem('ablemind-selected-context');
    if (user && savedContext) {
      sessionStorage.removeItem('ablemind-selected-context'); // Clean up
      router.push(`/assessment?context=${savedContext}`);
    }
  }, [user, router]);


  const handleStart = () => {
    if (!selectedContext) return;

    if (user) {
      router.push(`/assessment?context=${selectedContext}`);
    } else {
      // If user is not logged in, save context and redirect to login.
      sessionStorage.setItem('ablemind-selected-context', selectedContext);
      router.push('/login');
    }
  };

  if (isUserLoading) {
     return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Have you gone too deep with AI?
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Take the AbleMind Test - find out how balanced your intelligence is.
        </p>
      </div>

      <div className="mt-12 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-center font-headline text-2xl font-semibold">
          Choose how you mostly use AI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {contextOptions.map((option) => (
            <Card
              key={option.id}
              onClick={() => setSelectedContext(option.id)}
              className={cn(
                'cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                selectedContext === option.id
                  ? 'ring-2 ring-primary shadow-lg border-primary'
                  : 'border-border'
              )}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <option.icon className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl">{option.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Button
          size="lg"
          onClick={handleStart}
          disabled={!selectedContext || isUserLoading}
          className="group"
        >
          { isUserLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null }
          Start Assessment
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
