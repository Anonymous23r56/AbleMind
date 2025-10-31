import { config } from 'dotenv';
config();

import '@/ai/flows/generate-unique-challenges.ts';
import '@/ai/flows/interpret-user-responses.ts';
import '@/ai/flows/adjust-challenge-difficulty.ts';