'use server';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Import flows to ensure they are registered with Genkit
import '@/ai/flows/generate-unique-challenges';
import '@/ai/flows/interpret-user-responses';
import '@/ai/flows/adjust-challenge-difficulty';


export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is read automatically from the GEMINI_API_KEY environment variable
    }),
  ],
  logLevel: 'debug', // Keep logs for debugging
  enableTracingAndMetrics: true,
});
