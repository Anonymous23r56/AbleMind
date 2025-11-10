
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

// The output schema now expects text and an optional array of options.
// The challengeType will be determined based on the presence of options.
const GenerateUniqueChallengesOutputSchema = z.object({
  challengeText: z.string().describe('The main text of the micro-challenge.'),
  options: z
    .array(z.string())
    .optional()
    .describe(
      'An array of 3-4 options for multiple-choice questions. Leave empty for open-ended questions.'
    ),
  challengeType: z
    .string()
    .describe("The type of challenge, either 'open' or 'multipleChoice'."),
});
export type GenerateUniqueChallengesOutput = z.infer<typeof GenerateUniqueChallengesOutputSchema>;

const generateUniqueChallengesPrompt = ai.definePrompt({
  name: 'generateUniqueChallengesPrompt',
  input: {schema: GenerateUniqueChallengesInputSchema},
  // The output schema for the prompt itself is simpler. We'll add the challengeType in the flow.
  output: {
    schema: z.object({
      challengeText: z.string(),
      options: z.array(z.string()).optional(),
    }),
  },
  prompt: `You are an AI challenge generator. Create a concise micro-challenge for the AI usage context: {{{aiUsageContext}}}.

The challenge should assess cognitive skills relevant to that context.

You must generate one of two types of questions:
1.  An open-ended question/riddle.
2.  A multiple-choice question with 3 to 4 plausible options.

- For an open-ended question, provide only the 'challengeText'.
- For a multiple-choice question, provide the 'challengeText' and an array of strings in the 'options' field.

The question must be short and focused.
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
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }

    // Determine the challengeType based on the output.
    const challengeType =
      output.options && output.options.length > 0 ? 'multipleChoice' : 'open';
      
    return {
      challengeText: output.challengeText,
      options: output.options,
      challengeType: challengeType,
    };
  }
);

export async function generateUniqueChallenges(input: GenerateUniqueChallengesInput): Promise<GenerateUniqueChallengesOutput> {
  return generateUniqueChallengesFlow(input);
}
