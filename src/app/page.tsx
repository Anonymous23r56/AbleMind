'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Briefcase, School, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ContextOption = {
  id: 'Personal' | 'Education' | 'Professional';
  title: string;
  description: string;
  icon: React.ElementType;
};

const contextOptions: ContextOption[] = [
  {
    id: 'Personal',
    title: 'Personal Growth',
    description: 'Explore your cognitive skills for self-improvement and daily life.',
    icon: User,
  },
  {
    id: 'Education',
    title: 'Academic Success',
    description: 'Enhance your learning, studying, and critical thinking abilities.',
    icon: School,
  },
  {
    id: 'Professional',
    title: 'Career Development',
    description: 'Sharpen your mind for professional challenges and workplace excellence.',
    icon: Briefcase,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedContext, setSelectedContext] = useState<string | null>(null);

  const handleStart = () => {
    if (selectedContext) {
      router.push(`/assessment?context=${selectedContext}`);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Discover Your Cognitive Edge
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          AbleMind uses AI-driven micro-challenges to create a personalized map of your cognitive abilities. Start your journey to a sharper mind.
        </p>
      </div>

      <div className="mt-12 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-center font-headline text-2xl font-semibold">
          First, select your primary context
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
          disabled={!selectedContext}
          className="group"
        >
          Start Assessment
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
