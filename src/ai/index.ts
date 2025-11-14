'use server';

// This file is the single source of truth for initializing the Genkit 'ai' object.
// By isolating it here, we prevent circular dependencies.

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is read automatically from the GEMINI_API_KEY environment variable
    }),
  ],
  logLevel: 'debug', // Keep logs for debugging
  enableTracingAndMetrics: true,
});
