/**
 * Maggy - Voice Module
 * Handles speech synthesis (text-to-speech) and recognition (speech-to-text)
 */

class VoiceModule {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        this.isSpeaking = false;
        this.silentMode = false;
        this.speechRate = 1.0;
        this.preferredVoice = null;

        this.initRecognition();
        this.loadVoices();
    }

    // Initialize speech recognition
    initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
    }

    // Load available voices
    loadVoices() {
        const setVoice = () => {
            const voices = this.synthesis.getVoices();
            // Prefer natural English voices
            const preferredVoices = [
                'Samantha', // iOS
                'Google US English', // Chrome
                'Microsoft Zira', // Edge
                'en-US'
            ];

            for (const pref of preferredVoices) {
                const found = voices.find(v =>
                    v.name.includes(pref) || v.lang.includes(pref)
                );
                if (found) {
                    this.preferredVoice = found;
                    break;
                }
            }

            // Fallback to any English voice
            if (!this.preferredVoice) {
                this.preferredVoice = voices.find(v => v.lang.startsWith('en'));
            }
        };

        // Voices may load asynchronously
        if (this.synthesis.getVoices().length > 0) {
            setVoice();
        } else {
            this.synthesis.addEventListener('voiceschanged', setVoice);
        }
    }

    // ==========================================
    // TEXT-TO-SPEECH (Maggy speaks)
    // ==========================================

    /**
     * Prime audio context - call immediately on user action
     * This unlocks the browser's audio context for later TTS
     */
    primeAudio() {
        if (this.silentMode) return;

        // Speak empty string to "unlock" audio context
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        this.synthesis.speak(utterance);
        console.log('Audio context primed');
    }

    /**
     * Speak text aloud
     * @param {string} text - Text to speak
     * @param {Object} options - { slow: boolean, onStart: fn, onEnd: fn }
     * @returns {Promise} Resolves when speaking is done
     */
    speak(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (this.silentMode) {
                resolve();
                return;
            }

            // Wait for any pending speech to finish instead of canceling
            // This prevents the 'canceled' error
            if (this.synthesis.speaking) {
                this.synthesis.cancel();
                // Small delay after cancel
                setTimeout(() => {
                    this._doSpeak(text, options, resolve, reject);
                }, 50);
            } else {
                this._doSpeak(text, options, resolve, reject);
            }
        });
    }

    /**
     * Internal speak implementation
     */
    _doSpeak(text, options, resolve, reject) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = options.slow ? 0.75 : this.speechRate;
        utterance.pitch = 1.05; // Slightly higher for friendly tone
        utterance.volume = 1.0;

        if (this.preferredVoice) {
            utterance.voice = this.preferredVoice;
        }

        utterance.onstart = () => {
            this.isSpeaking = true;
            options.onStart?.();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            options.onEnd?.();
            resolve();
        };

        utterance.onerror = (error) => {
            this.isSpeaking = false;
            console.warn('Speech error:', error.error);
            // Don't reject on 'canceled' or 'interrupted' errors
            if (error.error !== 'canceled' && error.error !== 'interrupted') {
                reject(error);
            } else {
                resolve();
            }
        };

        this.synthesis.speak(utterance);
    }

    /**
     * Speak text slowly for learning
     */
    speakSlow(text, options = {}) {
        return this.speak(text, { ...options, slow: true });
    }

    /**
     * Stop speaking
     */
    stopSpeaking() {
        this.synthesis.cancel();
        this.isSpeaking = false;
    }

    // ==========================================
    // SPEECH-TO-TEXT (User speaks)
    // ==========================================

    /**
     * Start listening for speech
     * @param {Object} options - { onInterim: fn, onResult: fn, onError: fn, timeout: ms }
     * @returns {Promise<{transcript: string, confidence: number}>}
     */
    listen(options = {}) {
        return new Promise((resolve, reject) => {
            if (!this.recognition) {
                reject(new Error('Speech recognition not supported'));
                return;
            }

            if (this.isListening) {
                this.stopListening();
            }

            // Stop any ongoing speech first
            this.stopSpeaking();

            let finalTranscript = '';
            let timeoutId = null;

            const cleanup = () => {
                this.isListening = false;
                if (timeoutId) clearTimeout(timeoutId);
            };

            this.recognition.onstart = () => {
                this.isListening = true;
                options.onStart?.();
            };

            this.recognition.onresult = (event) => {
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript;
                    } else {
                        interimTranscript += result[0].transcript;
                    }
                }

                // Report interim results for UI feedback
                if (interimTranscript && options.onInterim) {
                    options.onInterim(interimTranscript);
                }
            };

            this.recognition.onend = () => {
                cleanup();

                if (finalTranscript) {
                    const result = {
                        transcript: finalTranscript.trim(),
                        confidence: 0.9 // Approximate, as we collect from multiple results
                    };
                    options.onResult?.(result);
                    resolve(result);
                } else {
                    // No speech detected
                    const error = new Error('No speech detected');
                    error.code = 'no_speech';
                    options.onError?.(error);
                    reject(error);
                }
            };

            this.recognition.onerror = (event) => {
                cleanup();
                const error = new Error(event.error);
                error.code = event.error;
                options.onError?.(error);
                reject(error);
            };

            // Set timeout for listening
            const timeout = options.timeout || 10000; // 10 seconds default
            timeoutId = setTimeout(() => {
                if (this.isListening) {
                    this.recognition.stop();
                }
            }, timeout);

            // Start listening
            try {
                this.recognition.start();
            } catch (error) {
                cleanup();
                reject(error);
            }
        });
    }

    /**
     * Stop listening
     */
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    // ==========================================
    // PRONUNCIATION COMPARISON
    // ==========================================

    /**
     * Compare spoken text with expected text
     * @param {string} expected - What they should have said
     * @param {string} actual - What they actually said
     * @returns {Object} { score, feedback, matches, mismatches }
     */
    comparePronunciation(expected, actual) {
        const expectedWords = this.normalizeText(expected).split(' ');
        const actualWords = this.normalizeText(actual).split(' ');

        const matches = [];
        const mismatches = [];
        let matchCount = 0;

        expectedWords.forEach((word, index) => {
            const actualWord = actualWords[index] || '';
            const similarity = this.wordSimilarity(word, actualWord);

            if (similarity >= 0.8) {
                matches.push({ word, similarity });
                matchCount++;
            } else {
                mismatches.push({
                    expected: word,
                    actual: actualWord || '(missing)',
                    similarity
                });
            }
        });

        // Check for extra words
        if (actualWords.length > expectedWords.length) {
            const extraWords = actualWords.slice(expectedWords.length);
            extraWords.forEach(word => {
                mismatches.push({
                    expected: '(nothing)',
                    actual: word,
                    similarity: 0
                });
            });
        }

        const score = expectedWords.length > 0
            ? Math.round((matchCount / expectedWords.length) * 100)
            : 0;

        return {
            score,
            matches,
            mismatches,
            feedback: this.generatePronunciationFeedback(score, mismatches)
        };
    }

    /**
     * Normalize text for comparison
     */
    normalizeText(text) {
        return text
            .toLowerCase()
            .replace(/[.,!?'"]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Calculate similarity between two words (Levenshtein-based)
     */
    wordSimilarity(word1, word2) {
        if (word1 === word2) return 1;
        if (!word1 || !word2) return 0;

        const len1 = word1.length;
        const len2 = word2.length;
        const maxLen = Math.max(len1, len2);

        if (maxLen === 0) return 1;

        // Simple Levenshtein distance
        const matrix = Array(len1 + 1).fill(null).map(() =>
            Array(len2 + 1).fill(null)
        );

        for (let i = 0; i <= len1; i++) matrix[i][0] = i;
        for (let j = 0; j <= len2; j++) matrix[0][j] = j;

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        const distance = matrix[len1][len2];
        return 1 - (distance / maxLen);
    }

    /**
     * Generate feedback based on pronunciation comparison
     */
    generatePronunciationFeedback(score, mismatches) {
        if (score >= 90) {
            return {
                type: 'excellent',
                message: "Perfect pronunciation! 🎉",
                tips: []
            };
        }

        if (score >= 70) {
            return {
                type: 'good',
                message: "Good job! Just a few small things to work on.",
                tips: this.generateTips(mismatches.slice(0, 2))
            };
        }

        if (score >= 50) {
            return {
                type: 'practice',
                message: "Getting there! Let's practice these words:",
                tips: this.generateTips(mismatches.slice(0, 3))
            };
        }

        return {
            type: 'retry',
            message: "Let's try again! Listen first, then repeat.",
            tips: this.generateTips(mismatches.slice(0, 2))
        };
    }

    /**
     * Generate pronunciation tips for mismatched words
     */
    generateTips(mismatches) {
        const tips = [];

        mismatches.forEach(({ expected, actual }) => {
            if (expected === '(nothing)') {
                tips.push(`You added "${actual}" - try to match exactly.`);
                return;
            }

            if (actual === '(missing)') {
                tips.push(`Don't forget to say "${expected}".`);
                return;
            }

            // Common Spanish-speaker pronunciation issues
            if (expected.includes('th') && !actual.includes('th')) {
                tips.push(`For "${expected}", put your tongue between your teeth for the 'th' sound.`);
            } else if (expected.startsWith('v') && actual.startsWith('b')) {
                tips.push(`"${expected}" starts with 'v' - bite your lower lip gently.`);
            } else if (expected !== actual) {
                tips.push(`"${expected}" sounds different from "${actual}" - listen and repeat!`);
            }
        });

        return tips;
    }

    // ==========================================
    // SETTINGS
    // ==========================================

    setSilentMode(silent) {
        this.silentMode = silent;
        if (silent) {
            this.stopSpeaking();
            this.stopListening();
        }
    }

    setSpeechRate(rate) {
        // Clamp between 0.5 and 1.5
        this.speechRate = Math.max(0.5, Math.min(1.5, rate));
    }

    /**
     * Check if speech features are available
     */
    getCapabilities() {
        return {
            synthesis: 'speechSynthesis' in window,
            recognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
            isListening: this.isListening,
            isSpeaking: this.isSpeaking,
            silentMode: this.silentMode
        };
    }
}

// Export singleton
export const voice = new VoiceModule();
export default voice;
