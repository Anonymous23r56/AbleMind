'use server';

import { CohereClient } from 'cohere-ai';
import { z } from 'zod'; // Use 'zod'

const cohere = new CohereClient({
  token: process.env.CO_API_KEY, // Use CO_API_KEY
});

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

export async function generateUniqueChallenges(
  input: GenerateUniqueChallengesInput
): Promise<GenerateUniqueChallengesOutput> {
  
  const prompt = `
    You are an expert AI tutor. Generate a single micro-challenge relevant to this context: "${input.aiUsageContext}"
    Use the random seed "${input.randomSeed}" to ensure you provide variety.

    RULES:
    1. You MUST RANDOMLY decide if the challenge is 'open' (where the user types the answer) or 'multipleChoice'. Aim for a mix. Do not just pick multipleChoice every time.
    2. IF 'multipleChoice': Provide 3-4 plausible options.
    3. IF 'open': 'options' array must be empty.
    4. Keep 'challengeText' concise.

    Your response MUST be ONLY the raw JSON object. Do not write any other text.
    Your response must perfectly match this Zod schema:
    {
      "challengeText": "...",
      "options": ["...", "..."],
      "challengeType": "..."
    }
  `;

  try {
    const response = await cohere.chat({
      model: 'command-r-08-2024', // The correct model
      message: prompt,
      temperature: 1.0,
      p: 0.95,
      seed: input.randomSeed ? Math.floor(input.randomSeed * 10000) : undefined,
    });

    const output = response.text;

    if (!output) {
      throw new Error('Cohere model returned empty output.');
    }

    const jsonMatch = output.match(/\{[\s\S]*\}/); // Safe JSON parsing
    
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON.');
    }

    return JSON.parse(jsonMatch[0]) as GenerateUniqueChallengesOutput;

  } catch (error) {
    console.error("AI Challenge Generation Failed (Cohere):", error);
    
    return {
      challengeType: 'multipleChoice',
      challengeText: 'Which of the following is a common application of AI in daily life?',
      options: ['Setting a standard alarm clock', 'Voice assistants (like Siri or Alexa)', 'Sending an email', 'Typing a document in a text editor'],
    } as GenerateUniqueChallengesOutput;
  }
}