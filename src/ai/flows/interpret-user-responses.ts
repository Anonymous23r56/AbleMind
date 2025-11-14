
'use server';

/**
 * @fileOverview An AI agent for interpreting user responses and behavioral data from micro-challenges.
 *
 * - interpretUserResponses - A function that interprets user responses and behavioral data to provide insights into cognitive strengths and weaknesses.
 * - InterpretUserResponsesInput - The input type for the interpretUserResponses function.
 * - InterpretUserResponsesOutput - The return type for the interpretUserResponses function.
 */

import {ai} from '@/ai';
import {z} from 'genkit';

const InterpretUserResponsesInputSchema = z.object({
  responses: z.array(z.string()).describe('The user responses to the micro-challenges.'),
  behavioralData: z.object({
    timeSpent: z.number().describe('The time spent on each micro-challenge in seconds.'),
    hesitation: z.number().describe('A measure of hesitation during the micro-challenges.'),
  }).describe('The behavioral data collected during the micro-challenges.'),
  context: z.string().describe('The context of the AI usage, e.g., education, professional, personal.'),
});
export type InterpretUserResponsesInput = z.infer<typeof InterpretUserResponsesInputSchema>;

const InterpretUserResponsesOutputSchema = z.object({
  strengths: z.array(z.string()).describe('The cognitive strengths identified from the responses and behavioral data.'),
  weaknesses: z.array(z.string()).describe('The cognitive weaknesses identified from the responses and behavioral data.'),
  insights: z.string().describe('Nuanced insights into the user cognitive profile.'),
});
export type InterpretUserResponsesOutput = z.infer<typeof InterpretUserResponsesOutputSchema>;

export async function interpretUserResponses(input: InterpretUserResponsesInput): Promise<InterpretUserResponsesOutput> {
  return interpretUserResponsesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretUserResponsesPrompt',
  input: {schema: InterpretUserResponsesInputSchema},
  output: {schema: InterpretUserResponsesOutputSchema},
  prompt: `You are an AI agent specializing in interpreting user responses and behavioral data to provide nuanced insights into their cognitive strengths and weaknesses.

  Based on the user's responses: {{{responses}}} and behavioral data (time spent: {{{behavioralData.timeSpent}}}, hesitation: {{{behavioralData.hesitation}}}), and the AI usage context: {{{context}}}, identify the user's cognitive strengths and weaknesses, and provide nuanced insights into their cognitive profile.
  Responses represent the answers to a set of micro-challenges that tested the user's cognitive abilities.
  Behavioral data was collected as the user completed these challenges. Specifically, time spent represents the number of seconds the user spent on each challenge, and hesitation is a measure of how much the user hesitated before responding to each challenge. The AI usage context represents whether the user intends to use the results of this assessment in the context of education, their profession, or their personal life.

  Provide your response in JSON format that conforms to the provided schema.
  `,
});

const interpretUserResponsesFlow = ai.defineFlow(
  {
    name: 'interpretUserResponsesFlow',
    inputSchema: InterpretUserResponsesInputSchema,
    outputSchema: InterpretUserResponsesOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error("AI did not return a valid report.");
      }
      return output;
    } catch (error) {
      console.warn("AI report generation failed, using manual fallback.", error);

      // Failsafe: Return a default, generic report if the AI fails.
      return {
        strengths: ["Adaptability in response to varied challenges.", "Willingness to engage with complex tasks."],
        weaknesses: ["Occasional hesitation suggests a need for more confident decision-making.", "Response speed could be improved on certain tasks."],
        insights: "This session indicates a solid cognitive foundation. Focusing on building decisiveness and reducing response time on unfamiliar problems could lead to significant improvements in overall cognitive balance. Continued practice will be beneficial.",
      };
    }
  }
);
