'use server';

// This file is now responsible for ensuring the AI flows are registered.
// It imports the initialized 'ai' object from a separate file to prevent circular dependencies.

import { ai } from '@/ai';

// Import flows to ensure they are registered with Genkit
import '@/ai/flows/generate-unique-challenges';
import '@/ai/flows/interpret-user-responses';
import '@/ai/flows/adjust-challenge-difficulty';

// Export the initialized 'ai' object so other parts of the app can use it without causing circular dependencies.
export { ai };
