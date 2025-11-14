'use server';

import { CohereClient } from 'cohere-ai';
import { z } from 'zod'; // Use 'zod'

const cohere = new CohereClient({
  token: process.env.CO_API_KEY, // Use CO_API_KEY
});

// --- SCHEMAS ---
const AdjustChallengeDifficultyInputSchema = z.object({
  currentDifficulty: z
    .number()
    .describe('The current difficulty level (1-10).'),
  userPerformance: z
    .number()
    .describe('A score from 1-10. 1 is poor, 10 is excellent.'),
  challengeType: z
    .string()
    .describe('The type of micro-challenge.'),
});
export type AdjustChallengeDifficultyInput = z.infer<typeof AdjustChallengeDifficultyInputSchema>;

const AdjustChallengeDifficultyOutputSchema = z.object({
  newDifficulty: z
    .number()
    .describe('The recommended difficulty level (1-10).'),
  reason: z
    .string()
    .describe('A brief explanation for the adjustment.'),
});
export type AdjustChallengeDifficultyOutput = z.infer<typeof AdjustChallengeDifficultyOutputSchema>;

export async function adjustChallengeDifficulty(
  input: AdjustChallengeDifficultyInput
): Promise<AdjustChallengeDifficultyOutput> {

  const prompt = `
    You are a difficulty adjustment algorithm. Calculate a new difficulty level.
    Current Difficulty: ${input.currentDifficulty}
    User Performance: ${input.userPerformance}

    RULES:
    1. If performance >= 8, INCREASE difficulty by 1.
    2. If performance <= 4, DECREASE difficulty by 1.
    3. If performance is 5-7, KEEP difficulty the same.
    4. New difficulty MUST be between 1 and 10.
    5. Provide a brief reason.

    Your response MUST be ONLY the raw JSON object. Do not write any other text.
    Your response must perfectly match this Zod schema:
    {
      "newDifficulty": 0,
      "reason": "..."
    }
  `;
  
  try {
    const response = await cohere.chat({
      model: 'command-r-08-2024', // The correct model
      message: prompt,
      temperature: 0.8,
    });

    const output = response.text;
    
    if (!output) {
      throw new Error("AI did not return a valid difficulty.");
    }
    
    const jsonMatch = output.match(/\{[\s\S]*\}/); // Safe JSON parsing
    
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON.');
    }

    return JSON.parse(jsonMatch[0]) as AdjustChallengeDifficultyOutput;

  } catch (error) {
      console.warn("AI difficulty adjustment failed, using manual fallback.", error);

      // Failsafe logic
      let newDifficulty = input.currentDifficulty;
      let reason = "Difficulty remains the same due to consistent performance.";

      if (input.userPerformance >= 8) {
          newDifficulty += 1;
          reason = "Difficulty increased due to strong performance.";
      } else if (input.userPerformance <= 4) {
          newDifficulty -= 1;
          reason = "Difficulty decreased to better match performance level.";
      }
      newDifficulty = Math.max(1, Math.min(10, newDifficulty));

      return {
          newDifficulty: newDifficulty,
          reason: reason,
      };
  }
}