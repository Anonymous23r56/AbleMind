
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { getInitialChallenge, submitAndGetNextChallenge, generateReport } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useUser } from '@/firebase';
import type { GenerateUniqueChallengesOutput } from '@/ai/flows/generate-unique-challenges';

const TOTAL_CHALLENGES = 5;

type BehavioralData = {
  timeSpent: number; // in s
  hesitation: number; // in s
};

export default function AssessmentClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [context, setContext] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [challenges, setChallenges] = useState<GenerateUniqueChallengesOutput[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [behavioralData, setBehavioralData] = useState<BehavioralData[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [difficulty, setDifficulty] = useState(5);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [challengeStartTime, setChallengeStartTime] = useState(0);
  const [firstInteractionTime, setFirstInteractionTime] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  useEffect(() => {
    const contextParam = searchParams.get('context');
    if (!contextParam) {
      toast({
        title: 'Error',
        description: 'No context selected. Redirecting to home.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }
    const decodedContext = decodeURIComponent(contextParam);
    setContext(decodedContext);

    const fetchInitialChallenge = async () => {
      setIsLoading(true);
      const result = await getInitialChallenge(decodedContext);
      if (result.success && result.challenge) {
        setChallenges([result.challenge]);
        setChallengeStartTime(Date.now());
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
        router.push('/');
      }
      setIsLoading(false);
    };

    fetchInitialChallenge();
  }, [router, searchParams, toast]);

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (firstInteractionTime === 0) {
      setFirstInteractionTime(Date.now());
    }
    setCurrentResponse(e.target.value);
  };
  
  const handleRadioResponseChange = (value: string) => {
    if (firstInteractionTime === 0) {
      setFirstInteractionTime(Date.now());
    }
    setCurrentResponse(value);
  };

  const calculatePerformance = (timeSpent: number) => {
    const baseScore = 10 - Math.floor(timeSpent / 5000);
    return Math.max(1, Math.min(10, baseScore));
  };

  const handleGenerateReport = async (
    finalResponses: string[],
    finalBehavioralData: BehavioralData[]
  ) => {
    const reportData = {
      responses: finalResponses,
      behavioralData: {
        timeSpent:
          finalBehavioralData.reduce((acc, b) => acc + b.timeSpent, 0) /
          finalBehavioralData.length,
        hesitation:
          finalBehavioralData.reduce((acc, b) => acc + b.hesitation, 0) /
          finalBehavioralData.length,
      },
      context: context!,
    };

    const reportResult = await generateReport(reportData);
    if (reportResult.success && reportResult.report && user) {
      try {
        const strengthsCount = reportResult.report.strengths.length;
        const weaknessesCount = reportResult.report.weaknesses.length;
        const total = strengthsCount + weaknessesCount;
        const score = total > 0 ? Math.round((strengthsCount / total) * 100) : 50;

        const sessionRef = doc(collection(firestore, 'users', user.uid, 'sessions'));

        const sessionData = {
          id: sessionRef.id,
          userId: user.uid,
          startTime: new Date(sessionStartTime).toISOString(),
          endTime: new Date().toISOString(),
          humanAiBalanceScore: score,
          ...reportResult.report,
        };

        await setDoc(sessionRef, sessionData);

        sessionStorage.setItem('ablemind-report', JSON.stringify(reportResult.report));
        router.push('/report');
      } catch (e: any) {
        console.error("Failed to save session or navigate", e);
        toast({
          title: 'Error',
          description: e.message || 'Could not save session or store report data.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Error',
        description: reportResult.error || 'Could not generate report.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const endTime = Date.now();
    const timeSpent = endTime - challengeStartTime;
    const hesitation =
      firstInteractionTime > 0 ? firstInteractionTime - challengeStartTime : timeSpent;

    const newBehavioralData = [
      ...behavioralData,
      { timeSpent: timeSpent / 1000, hesitation: hesitation / 1000 },
    ];
    const newResponses = [...responses, currentResponse];

    setBehavioralData(newBehavioralData);
    setResponses(newResponses);
    setCurrentResponse('');

    if (currentStep < TOTAL_CHALLENGES - 1) {
      const performance = calculatePerformance(timeSpent);
      const result = await submitAndGetNextChallenge(
        context!,
        difficulty,
        performance,
        'reasoning'
      );

      if (result.success && result.newChallenge) {
        setChallenges([...challenges, result.newChallenge]);
        setDifficulty(result.newDifficulty);
        setCurrentStep(currentStep + 1);
        setChallengeStartTime(Date.now());
        setFirstInteractionTime(0);
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      }
      setIsSubmitting(false);
    } else {
      await handleGenerateReport(newResponses, newBehavioralData);
    }
  };

  const progressValue = useMemo(
    () => ((currentStep + 1) / TOTAL_CHALLENGES) * 100,
    [currentStep]
  );
  
  const currentChallenge = challenges[currentStep];

  if (isLoading || !currentChallenge) {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4 md:py-20 animate-fade-in">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-1/4 mx-auto" />
        </div>
        <Card className="mt-8">
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-24 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4 md:py-20 animate-fade-in">
      <div className="space-y-4 mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-center">
          Cognitive Assessment
        </h1>
        <Progress value={progressValue} className="w-full" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            Challenge {currentStep + 1} of {TOTAL_CHALLENGES}
          </CardTitle>
          <CardDescription>
            Read the challenge carefully and provide your response.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[100px]">
          <p className="text-lg">{currentChallenge.challengeText}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          {currentChallenge.challengeType === 'open' ? (
            <Textarea
              placeholder="Type your response here..."
              value={currentResponse}
              onChange={handleResponseChange}
              rows={4}
              disabled={isSubmitting}
            />
          ) : (
             <RadioGroup 
                value={currentResponse} 
                onValueChange={handleRadioResponseChange}
                className="space-y-2"
                disabled={isSubmitting}
              >
                {currentChallenge.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || currentResponse.trim().length === 0}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {currentStep < TOTAL_CHALLENGES - 1
              ? 'Submit & Next Challenge'
              : 'Finish & See Report'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
