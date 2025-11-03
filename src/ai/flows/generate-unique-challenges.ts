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
  challengeType: z.enum(['open', 'multipleChoice']).describe('The type of challenge.'),
  challengeText: z.string().describe('The main text of the micro-challenge.'),
  options: z.array(z.string()).optional().describe('An array of options for multiple-choice questions.')
});
export type GenerateUniqueChallengesOutput = z.infer<typeof GenerateUniqueChallengesOutputSchema>;

const generateUniqueChallengesPrompt = ai.definePrompt({
  name: 'generateUniqueChallengesPrompt',
  input: {schema: GenerateUniqueChallengesInputSchema},
  output: {schema: GenerateUniqueChallengesOutputSchema},
  prompt: `You are an AI challenge generator. Your task is to create a unique and concise micro-challenge tailored to the following AI usage context: {{{aiUsageContext}}}.

The micro-challenge should be designed to assess a user's cognitive skills in a way that is relevant to the specified context.

You must generate a mix of question types. Sometimes, create a short, open-ended question. Other times, create a multiple-choice question with 3 to 4 plausible options. You can also generate a short logic puzzle or a riddle.

- For open-ended questions, logic puzzles, or riddles, set 'challengeType' to 'open' and provide the question in 'challengeText'.
- For multiple-choice questions, set 'challengeType' to 'multipleChoice', provide the question in 'challengeText', and provide an array of strings in the 'options' field.

The question should be short and focused, not packed with too much information.
`,
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
