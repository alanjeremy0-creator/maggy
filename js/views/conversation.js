/**
 * Maggy - Conversation View
 * AI-powered chat interface with voice support
 */

import { aiCoach } from '../modules/ai-coach.js';
import { voice } from '../modules/voice.js';
import { progress } from '../modules/progress.js';

let isInitialized = false;

export async function renderConversation(params) {
    const lessonId = params?.id || null;

    // Check API key
    if (!aiCoach.hasApiKey()) {
        return renderApiKeySetup();
    }

    return `
    <div class="conversation-view">
      <!-- Header -->
      <div class="conversation-header">
        <div class="conversation-header__avatar">🎓</div>
        <div class="conversation-header__info">
          <h1 class="conversation-header__name">Maggy</h1>
          <span class="conversation-header__status">Online</span>
        </div>
        <button class="conversation-header__settings" id="chat-settings">⚙️</button>
      </div>

      <!-- Messages -->
      <div class="chat-messages" id="chat-messages">
        <div class="chat-bubble chat-bubble--ai">
          <p class="chat-bubble__text">Loading...</p>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <input type="text" 
               class="chat-input" 
               id="chat-input" 
               placeholder="Type your message..."
               autocomplete="off">
        <button class="btn btn-icon btn-primary" id="voice-btn" title="Speak">
          🎤
        </button>
        <button class="btn btn-icon btn-primary" id="send-btn" title="Send">
          ➤
        </button>
      </div>
    </div>

    <!-- Voice Overlay (global, moved outside for proper positioning) -->
  `;
}

function renderApiKeySetup() {
    return `
    <div class="view onboarding-view">
      <span class="onboarding-logo">🔑</span>
      <h1 class="onboarding-title">API Key Required</h1>
      <p class="onboarding-subtitle">
        To chat with Maggy, you need to connect your Gemini API key.
      </p>
      
      <form class="onboarding-form" id="api-key-form">
        <input type="password" 
               class="input" 
               id="api-key-input" 
               placeholder="Enter your Gemini API key"
               required>
        <button type="submit" class="btn btn-primary btn-lg w-full">
          Connect
        </button>
        <p class="text-sm text-muted mt-2">
          Get your key at <a href="https://aistudio.google.com" target="_blank">aistudio.google.com</a>
        </p>
      </form>
    </div>
  `;
}

export async function initConversationEvents(params) {
    // Check if we need API key setup
    if (!aiCoach.hasApiKey()) {
        initApiKeyForm();
        return;
    }

    const lessonId = params?.id || null;
    const messagesContainer = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const voiceOverlay = document.getElementById('voice-overlay');
    const voiceTranscript = document.getElementById('voice-transcript');
    const stopListeningBtn = document.getElementById('stop-listening');

    // Initialize conversation
    if (!isInitialized) {
        try {
            const greeting = await aiCoach.startConversation(lessonId);
            messagesContainer.innerHTML = '';
            addMessage(greeting, 'ai');

            // Speak greeting
            if (!voice.silentMode) {
                await voice.speak(greeting);
            }

            isInitialized = true;
        } catch (error) {
            addMessage('Error starting conversation. Please check your API key.', 'ai');
        }
    }

    // Send message function
    async function sendMessage(text) {
        if (!text.trim()) return;

        // Add user message
        addMessage(text, 'user');
        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        // Show typing indicator
        const typingBubble = addTypingIndicator();

        try {
            const response = await aiCoach.sendMessage(text);

            // Remove typing indicator
            typingBubble.remove();

            // Add AI response
            addMessage(response, 'ai');

            // Speak response
            if (!voice.silentMode) {
                await voice.speak(response);
            }
        } catch (error) {
            typingBubble.remove();
            addMessage("Sorry, I couldn't process that. Try again?", 'ai');
        }

        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    }

    // Add message to chat
    function addMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble chat-bubble--${sender}`;
        bubble.innerHTML = `<p class="chat-bubble__text">${formatMessage(text)}</p>`;
        messagesContainer.appendChild(bubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return bubble;
    }

    // Format message with basic markdown
    function formatMessage(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/❌\s*(.*?)(?=(?:✅|$))/g, '<span style="color: var(--accent-error)">❌ $1</span>')
            .replace(/✅\s*(.*?)(?=(?:❌|$))/g, '<span style="color: var(--accent-success)">✅ $1</span>');
    }

    // Add typing indicator
    function addTypingIndicator() {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble chat-bubble--ai';
        bubble.innerHTML = `
      <p class="chat-bubble__text">
        <span class="animate-pulse">Thinking...</span>
      </p>
    `;
        messagesContainer.appendChild(bubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return bubble;
    }

    // Send button
    sendBtn?.addEventListener('click', () => {
        sendMessage(input.value);
    });

    // Enter key
    input?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input.value);
        }
    });

    // Voice input
    voiceBtn?.addEventListener('click', async () => {
        if (!voice.getCapabilities().recognition) {
            addMessage("Voice recognition isn't supported in your browser. Try Chrome!", 'ai');
            return;
        }

        // Show overlay
        voiceOverlay?.classList.remove('hidden');
        voiceTranscript.textContent = '';

        try {
            const result = await voice.listen({
                onInterim: (text) => {
                    voiceTranscript.textContent = text;
                },
                timeout: 10000
            });

            voiceOverlay?.classList.add('hidden');

            if (result.transcript) {
                sendMessage(result.transcript);
            }
        } catch (error) {
            voiceOverlay?.classList.add('hidden');

            if (error.code === 'no_speech') {
                addMessage("I didn't hear anything. Try again?", 'ai');
            } else if (error.code !== 'aborted') {
                addMessage("Couldn't use the microphone. Check your permissions!", 'ai');
            }
        }
    });

    // Stop listening
    stopListeningBtn?.addEventListener('click', () => {
        voice.stopListening();
        voiceOverlay?.classList.add('hidden');
    });

    // Settings button
    document.getElementById('chat-settings')?.addEventListener('click', () => {
        showSettings();
    });
}

function initApiKeyForm() {
    const form = document.getElementById('api-key-form');
    const input = document.getElementById('api-key-input');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const key = input.value.trim();
        if (!key) return;

        // Save key
        aiCoach.setApiKey(key);

        // Reload the view
        location.reload();
    });
}

async function showSettings() {
    const profile = await progress.getProfile();
    const silentMode = profile.settings?.silentMode || false;

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'settings-modal';
    modal.innerHTML = `
    <div class="settings-content">
      <div class="settings-handle"></div>
      <h2 class="settings-title">Settings</h2>
      
      <div class="settings-section">
        <h3 class="settings-section__title">Audio</h3>
        
        <div class="settings-item">
          <div>
            <p class="settings-item__label">Silent Mode</p>
            <p class="settings-item__description">Disable voice (for quiet environments)</p>
          </div>
          <div class="toggle ${silentMode ? 'active' : ''}" id="toggle-silent">
            <div class="toggle__handle"></div>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h3 class="settings-section__title">Account</h3>
        
        <div class="settings-item" style="cursor: pointer;" id="clear-chat">
          <div>
            <p class="settings-item__label">Clear Chat History</p>
            <p class="settings-item__description">Start a fresh conversation</p>
          </div>
        </div>
        
        <div class="settings-item" style="cursor: pointer;" id="change-api-key">
          <div>
            <p class="settings-item__label">Change API Key</p>
            <p class="settings-item__description">Update your Gemini API key</p>
          </div>
        </div>
      </div>
      
      <button class="btn btn-secondary w-full mt-4" id="close-settings">
        Close
      </button>
    </div>
  `;

    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Close button
    document.getElementById('close-settings')?.addEventListener('click', () => {
        modal.remove();
    });

    // Silent mode toggle
    document.getElementById('toggle-silent')?.addEventListener('click', async (e) => {
        const toggle = e.currentTarget;
        const newValue = !toggle.classList.contains('active');

        toggle.classList.toggle('active', newValue);
        voice.setSilentMode(newValue);
        await progress.updateSettings({ silentMode: newValue });
    });

    // Clear chat
    document.getElementById('clear-chat')?.addEventListener('click', () => {
        if (confirm('Clear chat history?')) {
            aiCoach.clearHistory();
            isInitialized = false;
            modal.remove();
            location.reload();
        }
    });

    // Change API key
    document.getElementById('change-api-key')?.addEventListener('click', () => {
        const newKey = prompt('Enter new Gemini API key:');
        if (newKey) {
            aiCoach.setApiKey(newKey);
            modal.remove();
            location.reload();
        }
    });
}

export default {
    render: renderConversation,
    afterRender: initConversationEvents
};
