'use server';

import { generateUniqueChallenges } from '@/ai/flows/generate-unique-challenges';
import { adjustChallengeDifficulty } from '@/ai/flows/adjust-challenge-difficulty';
import { interpretUserResponses } from '@/ai/flows/interpret-user-responses';
import type { InterpretUserResponsesInput } from '@/ai/flows/interpret-user-responses';

export async function getInitialChallenge(aiUsageContext: string) {
  try {
    const result = await generateUniqueChallenges({ aiUsageContext });
    return { success: true, challenge: result.challenge };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate challenge.' };
  }
}

export async function submitAndGetNextChallenge(
  aiUsageContext: string,
  currentDifficulty: number,
  userPerformance: number,
  challengeType: string
) {
  try {
    const [difficultyResult, challengeResult] = await Promise.all([
      adjustChallengeDifficulty({ currentDifficulty, userPerformance, challengeType }),
      generateUniqueChallenges({ aiUsageContext }),
    ]);
    
    return {
      success: true,
      newChallenge: challengeResult.challenge,
      newDifficulty: difficultyResult.newDifficulty,
      reason: difficultyResult.reason,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to process response and get next challenge.' };
  }
}

export async function generateReport(data: InterpretUserResponsesInput) {
  try {
    const result = await interpretUserResponses(data);
    return { success: true, report: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate report.' };
  }
}
