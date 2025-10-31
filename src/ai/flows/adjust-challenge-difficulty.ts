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
    .describe('The current difficulty level of the micro-challenges (e.g., 1-10).'),
  userPerformance: z
    .number()
    .describe(
      'A numerical representation of the user performance on the previous challenge (e.g., accuracy, speed).'
    ),
  challengeType: z
    .string()
    .describe('The type of micro-challenge (e.g., memory, reasoning, attention).'),
});
export type AdjustChallengeDifficultyInput = z.infer<typeof AdjustChallengeDifficultyInputSchema>;

const AdjustChallengeDifficultyOutputSchema = z.object({
  newDifficulty: z
    .number()
    .describe('The recommended difficulty level for the next micro-challenge.'),
  reason: z
    .string()
    .describe('The reason for the adjustment in difficulty level.'),
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
  prompt: `You are an AI that dynamically adjusts the difficulty of micro-challenges during a cognitive assessment. Based on the user's performance on the previous challenge, you should adjust the difficulty level for the next challenge to keep the user engaged and appropriately challenged.

Consider the following factors when adjusting the difficulty:
* Current Difficulty: {{{currentDifficulty}}}
* User Performance: {{{userPerformance}}}
* Challenge Type: {{{challengeType}}}

Reason your decision step by step. Based on the reasoning provide a new difficulty between 1 and 10 and the reason for the difficulty adjustment. Return as a JSON object.
`,
});

const adjustChallengeDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustChallengeDifficultyFlow',
    inputSchema: AdjustChallengeDifficultyInputSchema,
    outputSchema: AdjustChallengeDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustChallengeDifficultyPrompt(input);
    return output!;
  }
);
