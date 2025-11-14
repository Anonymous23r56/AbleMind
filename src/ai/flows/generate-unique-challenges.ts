
'use server';

/**
 * @fileOverview A flow that generates unique micro-challenges for the AbleMind assessment.
 *
 * This file defines the AI-powered flow for creating personalized micro-challenges
 * based on a user's selected AI usage context. It includes a random seed to
 * ensure that the generated challenges are unique for each session.
 *
 * - generateUniqueChallenges: The main function exported to be used by server actions.
 * - GenerateUniqueChallengesInput: The Zod schema for the input to the flow.
 * - GenerateUniqueChallengesOutput: The Zod schema for the output from the flow.
 */

import { ai } from '@/ai';
import { z } from 'genkit';

// --- SCHEMAS ---

const GenerateUniqueChallengesInputSchema = z.object({
  aiUsageContext: z.string().describe('The user-selected AI usage context.'),
  randomSeed: z.number().optional().describe('A random number to ensure uniqueness.'),
});

export type GenerateUniqueChallengesInput = z.infer<typeof GenerateUniqueChallengesInputSchema>;

const GenerateUniqueChallengesOutputSchema = z.object({
  challengeText: z.string().describe('The main text of the micro-challenge.'),
  options: z.array(z.string()).optional(),
  challengeType: z.enum(['open', 'multipleChoice']),
});

export type GenerateUniqueChallengesOutput = z.infer<typeof GenerateUniqueChallengesOutputSchema>;

// --- PROMPT ---

const generateUniqueChallengesPrompt = ai.definePrompt({
  name: 'generateUniqueChallengesPrompt',
  input: { schema: GenerateUniqueChallengesInputSchema },
  output: {
    schema: GenerateUniqueChallengesOutputSchema,
  },
  config: {
    temperature: 1.0, 
    topP: 0.95, 
  },
  prompt: `
    You are an expert AI tutor. Generate a unique micro-challenge for this context: "{{aiUsageContext}}".
    Current Random Seed: {{randomSeed}}.

    RULES:
    1. Decide if it is 'open' or 'multipleChoice'.
    2. IF 'multipleChoice': Provide 3-4 plausible options.
    3. IF 'open': 'options' must be empty.
    4. Keep it concise.

    Output strictly valid JSON that conforms to the provided schema.
  `,
});

// --- FLOW ---

const generateUniqueChallengesFlow = ai.defineFlow(
  {
    name: 'generateUniqueChallengesFlow',
    inputSchema: GenerateUniqueChallengesInputSchema,
    outputSchema: GenerateUniqueChallengesOutputSchema,
  },
  async (input) => {
    try {
      // Inject randomness to ensure a different challenge is generated each time.
      const inputWithSeed = {
        ...input,
        randomSeed: input.randomSeed || Math.random(), 
      };

      const response = await generateUniqueChallengesPrompt(inputWithSeed);
      const output = response.output;

      if (!output) {
        throw new Error('Model returned empty output.');
      }

      return output;
    } catch (error) {
      console.error("AI Challenge Generation Failed:", error);
      
      // Return a failsafe question if the AI call fails for any reason.
      // We explicitly cast this object to satisfy the strict TypeScript schema.
      return {
        challengeType: 'multipleChoice',
        challengeText: 'Which of the following is a common application of AI in daily life?',
        options: ['Sending an email', 'Voice assistants (like Siri or Alexa)', 'Setting a standard alarm clock', 'Typing a document in a text editor'],
      } as GenerateUniqueChallengesOutput;
    }
  }
);

/**
 * The main exported function that server actions should call.
 * This correctly invokes the Genkit flow to generate a challenge.
 */
export async function generateUniqueChallenges(input: GenerateUniqueChallengesInput): Promise<GenerateUniqueChallengesOutput> {
  return generateUniqueChallengesFlow(input);
}
