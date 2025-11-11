'use server';

/**
 * @fileOverview A flow that dynamically adjusts the difficulty of micro-challenges based on user performance.
 *
 * - adjustChallengeDifficulty - A function that adjusts the difficulty of the next micro-challenge.
 * - AdjustChallengeDifficultyInput - The input type for the adjustChallengeDifficulty function.
 * - AdjustChallengeDifficultyOutput - The return type for the adjustChallengeDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustChallengeDifficultyInputSchema = z.object({
  currentDifficulty: z
    .number()
    .describe('The current difficulty level of the micro-challenges (1-10).'),
  userPerformance: z
    .number()
    .describe(
      'A score from 1-10 representing user performance on the previous challenge. 1 is poor, 10 is excellent.'
    ),
  challengeType: z
    .string()
    .describe('The type of micro-challenge (e.g., memory, reasoning, attention).'),
});
export type AdjustChallengeDifficultyInput = z.infer<typeof AdjustChallengeDifficultyInputSchema>;

const AdjustChallengeDifficultyOutputSchema = z.object({
  newDifficulty: z
    .number()
    .describe('The recommended difficulty level for the next micro-challenge (must be between 1 and 10).'),
  reason: z
    .string()
    .describe('A brief explanation for the difficulty adjustment.'),
});
export type AdjustChallengeDifficultyOutput = z.infer<typeof AdjustChallengeDifficultyOutputSchema>;

export async function adjustChallengeDifficulty(
  input: AdjustChallengeDifficultyInput
): Promise<AdjustChallengeDifficultyOutput> {
  return adjustChallengeDifficultyFlow(input);
}

const adjustChallengeDifficultyPrompt = ai.definePrompt({
  name: 'adjustChallengeDifficultyPrompt',
  input: {schema: AdjustChallengeDifficultyInputSchema},
  output: {schema: AdjustChallengeDifficultyOutputSchema},
  prompt: `You are a difficulty adjustment algorithm. Your task is to calculate a new difficulty level based on the provided data.

RULES:
1.  Start with the current difficulty: {{{currentDifficulty}}}.
2.  Analyze the user's performance score: {{{userPerformance}}}.
3.  If performance is 8 or higher, INCREASE difficulty by 1.
4.  If performance is 4 or lower, DECREASE difficulty by 1.
5.  If performance is between 5 and 7, KEEP the same difficulty.
6.  The new difficulty MUST NOT go below 1 or above 10.
7.  Provide a brief, one-sentence reason for your decision.

Your response MUST be a single JSON object with 'newDifficulty' and 'reason' fields.

Current Difficulty: {{{currentDifficulty}}}
User Performance: {{{userPerformance}}}
`,
});

const adjustChallengeDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustChallengeDifficultyFlow',
    inputSchema: AdjustChallengeDifficultyInputSchema,
    outputSchema: AdjustChallengeDifficultyOutputSchema,
  },
  async input => {
    try {
        const {output} = await adjustChallengeDifficultyPrompt(input);
        if (!output || typeof output.newDifficulty !== 'number') {
          throw new Error("AI did not return a valid difficulty.");
        }
        
        // Failsafe logic to clamp the difficulty value
        output.newDifficulty = Math.max(1, Math.min(10, Math.round(output.newDifficulty)));
        
        return output;

    } catch (error) {
        console.warn("AI difficulty adjustment failed, using manual fallback.", error);

        // Failsafe logic: Manually calculate the difficulty if the AI fails.
        let newDifficulty = input.currentDifficulty;
        let reason = "Difficulty remains the same due to consistent performance.";

        if (input.userPerformance >= 8) {
            newDifficulty += 1;
            reason = "Difficulty increased due to strong performance.";
        } else if (input.userPerformance <= 4) {
            newDifficulty -= 1;
            reason = "Difficulty decreased to better match performance level.";
        }

        // Clamp the difficulty between 1 and 10
        newDifficulty = Math.max(1, Math.min(10, newDifficulty));

        return {
            newDifficulty: newDifficulty,
            reason: reason,
        };
    }
  }
);
