// This file is used for local Genkit development and is not needed for the main app.
// The flows are now imported directly in src/ai/genkit.ts to ensure they are registered.
import { genkit } from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

import './flows/generate-unique-challenges';
import './flows/interpret-user-responses';
import './flows/adjust-challenge-difficulty';

export default genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
