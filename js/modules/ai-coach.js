/**
 * Maggy - AI Coach Module
 * Handles Gemini API integration for conversational learning
 */

import { buildConversationPrompt, GREETING_MESSAGES, randomResponse } from '../data/prompts.js';
import progress from './progress.js';

// Gemini API endpoint - using gemini-pro for better compatibility
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

class AICoachModule {
    constructor() {
        this.apiKey = null;
        this.conversationHistory = [];
        this.maxHistoryLength = 20; // Keep last 20 messages for context
        this.isProcessing = false;
        this.currentLesson = null;

        this.init();
    }

    async init() {
        // Try to get API key from environment or localStorage
        this.apiKey = this.getApiKey();
    }

    /**
     * Get API key from various sources
     * Priority: env variable > localStorage
     */
    getApiKey() {
        // For Vercel deployment, this would be injected
        if (typeof window !== 'undefined' && window.GEMINI_API_KEY) {
            return window.GEMINI_API_KEY;
        }

        // Check localStorage (for local development)
        const stored = localStorage.getItem('maggy_api_key');
        if (stored) {
            return stored;
        }

        return null;
    }

    /**
     * Set API key (for onboarding flow)
     */
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('maggy_api_key', key);
    }

    /**
     * Check if API key is configured
     */
    hasApiKey() {
        return !!this.apiKey;
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Start a new conversation with a specific lesson focus
     */
    async startConversation(lessonId = null) {
        this.clearHistory();
        this.currentLesson = lessonId;

        // Get user progress for context
        const userProgress = await progress.getAIContext();
        if (lessonId) {
            userProgress.currentLesson = lessonId;
        }

        // Build system prompt
        this.systemPrompt = buildConversationPrompt(userProgress, 'conversation');

        // Generate greeting
        const streak = userProgress.streak || 0;
        const isFirstTime = !userProgress.masteredTopics?.length;

        let greeting;
        if (lessonId) {
            // Get lesson title
            const { CURRICULUM } = await import('../data/lessons-content.js');
            const lesson = CURRICULUM.find(l => l.id === lessonId);
            greeting = GREETING_MESSAGES.startLesson(lesson?.title || 'a new topic');
        } else if (isFirstTime) {
            greeting = GREETING_MESSAGES.firstTime;
        } else if (streak > 0) {
            greeting = GREETING_MESSAGES.returningStreak(streak);
        } else {
            greeting = GREETING_MESSAGES.returningNoStreak;
        }

        // Add greeting to history
        this.conversationHistory.push({
            role: 'model',
            parts: [{ text: greeting }]
        });

        return greeting;
    }

    /**
     * Send a message to the AI coach
     * @param {string} userMessage - User's message
     * @param {Object} options - { mode: 'conversation'|'quiz'|'practice' }
     * @returns {Promise<string>} AI response
     */
    async sendMessage(userMessage, options = {}) {
        if (!this.apiKey) {
            throw new Error('API key not configured');
        }

        if (this.isProcessing) {
            throw new Error('Already processing a message');
        }

        this.isProcessing = true;

        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // Get fresh context
            const userProgress = await progress.getAIContext();
            if (this.currentLesson) {
                userProgress.currentLesson = this.currentLesson;
            }

            // Build current system prompt with latest context
            const systemPrompt = buildConversationPrompt(userProgress, options.mode || 'conversation');

            // Prepare request body
            const requestBody = {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: systemPrompt }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'I understand. I am Maggy, ready to help practice English!' }]
                    },
                    ...this.conversationHistory
                ],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 256, // Keep responses short
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
                ]
            };

            // Make API request
            console.log('Sending to Gemini API...');
            const response = await fetch(`${API_URL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('API Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', errorData);
                const errorMsg = errorData.error?.message || `API error: ${response.status}`;
                throw new Error(errorMsg);
            }

            const data = await response.json();

            // Extract response text
            const aiResponse = this.extractResponseText(data);

            // Add AI response to history
            this.conversationHistory.push({
                role: 'model',
                parts: [{ text: aiResponse }]
            });

            // Trim history if too long
            this.trimHistory();

            // Track exercise completion
            await progress.incrementExercise();

            return aiResponse;

        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Extract text from Gemini response
     */
    extractResponseText(response) {
        try {
            const candidate = response.candidates?.[0];
            if (!candidate) {
                throw new Error('No response candidate');
            }

            // Check for blocked content
            if (candidate.finishReason === 'SAFETY') {
                return "Let's keep our conversation friendly and focused on learning English! 😊 What would you like to practice?";
            }

            const text = candidate.content?.parts?.[0]?.text;
            if (!text) {
                throw new Error('No text in response');
            }

            return text.trim();
        } catch (error) {
            console.error('Error extracting response:', error);
            return "I didn't quite catch that. Could you try again? 🤔";
        }
    }

    /**
     * Trim conversation history to max length
     */
    trimHistory() {
        if (this.conversationHistory.length > this.maxHistoryLength) {
            // Keep first message (greeting) and last N-1 messages
            const first = this.conversationHistory[0];
            const recent = this.conversationHistory.slice(-(this.maxHistoryLength - 1));
            this.conversationHistory = [first, ...recent];
        }
    }

    /**
     * Get AI feedback on a quiz answer
     */
    async getQuizFeedback(question, userAnswer, correctAnswer, isCorrect) {
        const context = isCorrect
            ? `The student answered correctly! Question: "${question}" Their answer: "${userAnswer}" Give a brief celebration and encouragement.`
            : `The student made a mistake. Question: "${question}" They said: "${userAnswer}" Correct answer: "${correctAnswer}" Explain gently why their answer was wrong and help them understand.`;

        try {
            const response = await this.sendMessage(context, { mode: 'quiz' });
            return response;
        } catch (error) {
            // Fallback responses
            return isCorrect
                ? randomResponse('perfect')
                : `The correct answer is "${correctAnswer}". ${randomResponse('encouragement')}`;
        }
    }

    /**
     * Get pronunciation feedback from AI
     */
    async getPronunciationFeedback(expected, actual, score) {
        const context = score >= 80
            ? `Student pronounced "${expected}" very well (${score}% accuracy). Give quick praise!`
            : `Student tried to say "${expected}" but said "${actual}" (${score}% accuracy). Give a brief, encouraging tip for pronunciation.`;

        try {
            return await this.sendMessage(context, { mode: 'practice' });
        } catch (error) {
            return score >= 80
                ? "Great pronunciation! 🎉"
                : `Try again! Focus on "${expected}". You can do it! 💪`;
        }
    }

    /**
     * Generate a practice sentence for the current lesson
     */
    async generatePracticeSentence() {
        const context = "Generate a simple practice sentence for the student to say aloud, based on the current lesson focus. Just give the sentence, nothing else.";

        try {
            return await this.sendMessage(context, { mode: 'practice' });
        } catch (error) {
            // Fallback sentences
            const fallbacks = [
                "I am happy today.",
                "She is my friend.",
                "They are at home.",
                "Do you like coffee?",
                "He doesn't work on Sundays."
            ];
            return fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }
    }

    /**
     * Analyze user's response for errors
     * @returns {Object} { hasError, errorType, correction, explanation }
     */
    async analyzeResponse(userMessage) {
        const context = `Analyze this English sentence for grammar errors. Be brief.
Sentence: "${userMessage}"

If correct, respond with: {"correct": true}
If errors, respond with: {"correct": false, "errorType": "grammar", "correction": "corrected sentence", "explanation": "brief explanation"}

Only respond with JSON, nothing else.`;

        try {
            const response = await fetch(`${API_URL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: context }] }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 150
                    }
                })
            });

            const data = await response.json();
            const text = this.extractResponseText(data);

            // Parse JSON response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const analysis = JSON.parse(jsonMatch[0]);

                // Track error if found
                if (!analysis.correct && analysis.errorType) {
                    await progress.recordError({
                        type: analysis.errorType,
                        pattern: analysis.errorType,
                        example: userMessage,
                        lessonId: this.currentLesson
                    });
                }

                return analysis;
            }

            return { correct: true };
        } catch (error) {
            console.error('Error analyzing response:', error);
            return { correct: true }; // Assume correct on error
        }
    }
}

// Export singleton
export const aiCoach = new AICoachModule();
export default aiCoach;
