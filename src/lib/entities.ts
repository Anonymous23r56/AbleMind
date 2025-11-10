/**
 * Represents a user in the AbleMind application.
 */
export interface User {
  id: string; // Unique identifier for the user entity.
  email: string; // User's email address.
  username?: string; // User's username.
  onboardingContext?: string; // The AI usage context selected during onboarding.
  isAdmin?: boolean; // Indicates if the user has administrative privileges.
  createdAt?: string; // Timestamp indicating when the user account was created.
  updatedAt?: string; // Timestamp indicating when the user account was last updated.
}

/**
 * Represents a user session, tracking cognitive challenges and behavioral data.
 */
export interface Session {
  id: string; // Unique identifier for the session entity.
  userId: string; // Reference to User. (Relationship: User 1:N Session)
  startTime: string; // Timestamp indicating when the session started.
  endTime: string; // Timestamp indicating when the session ended.
  humanAiBalanceScore: number; // The calculated Human-AI Balance Score for this session.
  strengths: string[]; // Cognitive strengths identified in the session.
  weaknesses: string[]; // Cognitive weaknesses identified in the session.
  insights: string; // Nuanced insights from the session.
}

/**
 * Represents a single micro-challenge within a session.
 */
export interface Challenge {
  id: string; // Unique identifier for the challenge entity.
  sessionId: string; // Reference to Session. (Relationship: Session 1:N Challenge)
  challengeType: string; // Type of cognitive skill assessed by this challenge.
  content: string; // The textual or visual content of the challenge.
  userResponse: string; // The user's response to the challenge.
  timeSpent: number; // Time spent by the user on this challenge (in seconds).
  hesitation: boolean; // Indicates if the user hesitated before responding.
  aiInterpretation: string; // The AI's interpretation of the user's response and behavior.
  difficultyLevel: number; // The difficulty level of the challenge.
  type: 'open' | 'multipleChoice'; // The format of the challenge.
  options?: string[]; // A list of options for multiple choice questions.
}
