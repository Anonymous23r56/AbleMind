
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

  options: z.array(z.string()).optional().describe('An array of 3 to 4 plausible options for multiple-choice questions.')

});
export type GenerateUniqueChallengesOutput = z.infer<typeof GenerateUniqueChallengesOutputSchema>;

const generateUniqueChallengesPrompt = ai.definePrompt({
  name: 'generateUniqueChallengesPrompt',
  input: {schema: GenerateUniqueChallengesInputSchema},
<<<<<<< HEAD
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
=======
  output: {schema: GenerateUniqueChallengesOutputSchema},
  prompt: `You are an AI that creates a single, concise micro-challenge. The challenge must be relevant to this AI usage context: {{{aiUsageContext}}}.

RULES:
1.  The challenge must be a single question or task.
2.  You MUST decide if the question is open-ended or multiple-choice.
3.  If it is multiple-choice, you MUST provide 3 to 4 plausible options in the 'options' array.
4.  If it is open-ended, the 'options' array MUST be empty or not present.
5.  Set 'challengeType' to 'multipleChoice' if you provide options.
6.  Set 'challengeType' to 'open' if you do not provide options.
7.  The challenge text must be short and clear.

Your entire response must be a single JSON object that perfectly matches the required output schema.
>>>>>>> 68a43dd (okay so the assessment loads now but it just all of a suddens says error)
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
<<<<<<< HEAD
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
=======
    
    if (!output) {
      throw new Error("The AI model did not return a valid challenge.");
    }
    
    // Failsafe logic: Ensure the challengeType is consistent with the options provided.
    const hasOptions = output.options && output.options.length > 0;
    
    if (hasOptions) {
      output.challengeType = 'multipleChoice';
    } else {
      output.challengeType = 'open';
      delete output.options; // Clean up empty array if present
    }

    return output;
>>>>>>> 68a43dd (okay so the assessment loads now but it just all of a suddens says error)
  }
);

export async function generateUniqueChallenges(input: GenerateUniqueChallengesInput): Promise<GenerateUniqueChallengesOutput> {
  return generateUniqueChallengesFlow(input);
}
