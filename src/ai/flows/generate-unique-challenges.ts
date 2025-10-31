'use server';

/**
 * @fileOverview A flow for generating unique micro-challenges tailored to the user's selected AI usage context.
 *
 * This file exports:
 * - `generateUniqueChallenges`: An async function that generates unique micro-challenges.
 * - `GenerateUniqueChallengesInput`: The input type for `generateUniqueChallenges`.
 * - `GenerateUniqueChallengesOutput`: The output type for `generateUniqueChallenges`.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUniqueChallengesInputSchema = z.object({
  aiUsageContext: z.string().describe('The user-selected AI usage context.'),
});
export type GenerateUniqueChallengesInput = z.infer<typeof GenerateUniqueChallengesInputSchema>;

const GenerateUniqueChallengesOutputSchema = z.object({
  challenge: z.string().describe('A unique micro-challenge tailored to the specified AI usage context.'),
});
export type GenerateUniqueChallengesOutput = z.infer<typeof GenerateUniqueChallengesOutputSchema>;

const generateUniqueChallengesPrompt = ai.definePrompt({
  name: 'generateUniqueChallengesPrompt',
  input: {schema: GenerateUniqueChallengesInputSchema},
  output: {schema: GenerateUniqueChallengesOutputSchema},
  prompt: `You are an AI challenge generator. Generate a unique micro-challenge tailored to the following AI usage context: {{{aiUsageContext}}}. The micro-challenge should be designed to assess the user's cognitive skills in a way that is relevant to the specified context.`,
});

const generateUniqueChallengesFlow = ai.defineFlow(
  {
    name: 'generateUniqueChallengesFlow',
    inputSchema: GenerateUniqueChallengesInputSchema,
    outputSchema: GenerateUniqueChallengesOutputSchema,
  },
  async input => {
    const {output} = await generateUniqueChallengesPrompt(input);
    return output!;
  }
);

export async function generateUniqueChallenges(input: GenerateUniqueChallengesInput): Promise<GenerateUniqueChallengesOutput> {
  return generateUniqueChallengesFlow(input);
}
