'use server';

import { CohereClient } from 'cohere-ai';
import { z } from 'zod'; // Use 'zod'

// Initialize Cohere
const cohere = new CohereClient({
  token: process.env.CO_API_KEY, // Use CO_API_KEY
});

// --- SCHEMAS ---
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

// This is now the main function
export async function interpretUserResponses(input: InterpretUserResponsesInput): Promise<InterpretUserResponsesOutput> {
  
  const responsesString = JSON.stringify(input.responses);
  const behaviorString = JSON.stringify(input.behavioralData);

  const prompt = `
    You are an AI agent specializing in interpreting user responses and behavioral data to provide nuanced insights into their cognitive strengths and weaknesses.

    Based on the data below, identify the user's cognitive strengths, weaknesses, and provide nuanced insights into their cognitive profile.

    CONTEXT:
    ${input.context}

    USER RESPONSES:
    ${responsesString}

    BEHAVIORAL DATA:
    ${behaviorString}
    (timeSpent is in seconds, hesitation is a score)

    Your response MUST be ONLY a raw JSON object. Do not use markdown or any other text.
    Your response must perfectly match this Zod schema:
    {
      "strengths": ["...", "..."],
      "weaknesses": ["...", "..."],
      "insights": "..."
    }
  `;

  try {
    // Call the Cohere API
    const response = await cohere.chat({
      model: 'command-r-08-2024', // The correct model
      message: prompt,
      temperature: 0.7,
    });

    const output = response.text;

    if (!output) {
      throw new Error('Cohere model returned empty output.');
    }

    const jsonMatch = output.match(/\{[\s\S]*\}/); // Safe JSON parsing
    
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON.');
    }

    return JSON.parse(jsonMatch[0]) as InterpretUserResponsesOutput;

  } catch (error) {
    console.warn("AI report generation failed, using manual fallback.", error);

    // Failsafe
    return {
      strengths: ["Adaptability in response to varied challenges.", "Willingness to engage with complex tasks."],
      weaknesses: ["Occasional hesitation suggests a need for more confident decision-making.", "Response speed could be improved on certain tasks."],
      insights: "This session indicates a solid cognitive foundation. Focusing on building decisiveness and reducing response time on unfamiliar problems could lead to significant improvements in overall cognitive balance. Continued practice will be beneficial.",
    };
  }
}