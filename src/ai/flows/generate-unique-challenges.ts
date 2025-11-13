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

// The output schema is corrected to define 'options' and 'challengeType' once.
const GenerateUniqueChallengesOutputSchema = z.object({
  challengeText: z.string().describe('The main text of the micro-challenge.'),

  options: z
    .array(z.string())
    .optional()
    .describe('An array of 3 to 4 plausible options for multiple-choice questions.'),
    
  challengeType: z
    .enum(['open', 'multipleChoice']) // Use enum for stricter type checking
    .describe("The type of challenge, either 'open' or 'multipleChoice'."),
});
export type GenerateUniqueChallengesOutput = z.infer<typeof GenerateUniqueChallengesOutputSchema>;

const generateUniqueChallengesPrompt = ai.definePrompt({
  name: 'generateUniqueChallengesPrompt',
  input: {schema: GenerateUniqueChallengesInputSchema},

  // Use the full final output schema to ensure the model returns what is expected.
  output: {schema: GenerateUniqueChallengesOutputSchema},
  
  prompt: `You are an AI that creates a single, concise micro-challenge. The challenge must be relevant to this AI usage context: {{{aiUsageContext}}}.

RULES:
1. The challenge must be a single question or task.
2. You MUST decide if the question is open-ended or multiple-choice.
3. If it is multiple-choice, you MUST provide 3 to 4 plausible options in the 'options' array.
4. If it is open-ended, the 'options' array MUST be empty or not present.
5. Set 'challengeType' to 'multipleChoice' if you provide options.
6. Set 'challengeType' to 'open' if you do not provide options.
7. The challenge text must be short and clear.

Your entire response must be a single JSON object that perfectly matches the required output schema.

`,
});

const generateUniqueChallengesFlow = ai.defineFlow(
  {
    name: 'generateUniqueChallengesFlow',
    inputSchema: GenerateUniqueChallengesInputSchema,
    outputSchema: GenerateUniqueChallengesOutputSchema,
  },
  async input => {
    try {
      const {output} = await generateUniqueChallengesPrompt(input);
      if (!output) {
        throw new Error('The AI model did not return a valid challenge.');
      }
      return output;
    } catch (error) {
      console.warn("AI challenge generation failed, using manual fallback.", error);

      // Failsafe: Return a default, hard-coded challenge if the AI fails.
      return {
        challengeType: 'multipleChoice',
        challengeText: 'Which of the following is a common application of AI?',
        options: ['Sending an email', 'Voice assistants (like Siri or Alexa)', 'Setting an alarm clock', 'Typing a document'],
      };
    }
  }
);

export async function generateUniqueChallenges(input: GenerateUniqueChallengesInput): Promise<GenerateUniqueChallengesOutput> {
  return generateUniqueChallengesFlow(input);
}
