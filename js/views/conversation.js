/**
 * Maggy - Conversation View
 * AI-powered chat interface with voice support
 */

import { aiCoach } from '../modules/ai-coach.js';
import { voice } from '../modules/voice.js';
import { progress } from '../modules/progress.js';

let isInitialized = false;
let messagesContainer = null;

// Helper functions (moved outside for proper scope)
function addMessage(text, sender) {
  if (!messagesContainer) {
    messagesContainer = document.getElementById('chat-messages');
  }
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-bubble--${sender}`;
  bubble.innerHTML = `<p class="chat-bubble__text">${formatMessage(text)}</p>`;
  messagesContainer.appendChild(bubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return bubble;
}

function formatMessage(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/❌\s*(.*?)(?=(?:✅|$))/g, '<span style="color: var(--accent-error)">❌ $1</span>')
    .replace(/✅\s*(.*?)(?=(?:❌|$))/g, '<span style="color: var(--accent-success)">✅ $1</span>');
}

function addTypingIndicator() {
  if (!messagesContainer) {
    messagesContainer = document.getElementById('chat-messages');
  }
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
  messagesContainer = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const voiceBtn = document.getElementById('voice-btn');

  if (!messagesContainer || !input || !sendBtn) {
    console.error('Chat elements not found');
    return;
  }

  // Send message function
  async function sendMessage(text) {
    if (!text.trim()) return;

    // IMPORTANT: Prime audio immediately on user action to unlock TTS
    // This prevents browser autoplay policy from blocking speech later
    if (!voice.silentMode) {
      voice.primeAudio();
    }

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
      console.error('AI error:', error);
      typingBubble.remove();
      addMessage("Sorry, I couldn't process that. Try again?", 'ai');
    }

    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ATTACH EVENT LISTENERS FIRST (before async operations)
  // Send button click
  sendBtn.addEventListener('click', () => {
    console.log('Send button clicked');
    sendMessage(input.value);
  });

  // Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  // Voice input
  voiceBtn.addEventListener('click', async () => {
    console.log('Voice button clicked');

    if (!voice.getCapabilities().recognition) {
      addMessage("Voice recognition isn't supported in your browser. Try Chrome!", 'ai');
      return;
    }

    try {
      addMessage("🎤 Listening... (speak now)", 'ai');

      const result = await voice.listen({
        onInterim: (text) => {
          console.log('Interim:', text);
        },
        timeout: 10000
      });

      if (result.transcript) {
        sendMessage(result.transcript);
      }
    } catch (error) {
      console.error('Voice error:', error);
      if (error.code === 'no_speech') {
        addMessage("I didn't hear anything. Try again?", 'ai');
      } else if (error.code !== 'aborted') {
        addMessage("Couldn't use the microphone. Check your permissions!", 'ai');
      }
    }
  });

  // Settings button
  document.getElementById('chat-settings')?.addEventListener('click', () => {
    showSettings();
  });

  console.log('Conversation events initialized - buttons ready!');

  // NOW initialize conversation (async, won't block buttons)
  if (!isInitialized) {
    initializeConversation(lessonId);
  }
}

// Separate async function for initialization
async function initializeConversation(lessonId) {
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
    console.error('Conversation init error:', error);
    messagesContainer.innerHTML = '';
    addMessage('Error starting conversation. Please check your API key.', 'ai');
  }
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
        
        <div class="settings-item">
          <div style="width: 100%;">
            <p class="settings-item__label">API Key</p>
            <input type="text" 
                   id="api-key-field" 
                   class="input" 
                   placeholder="Paste your Gemini API key"
                   style="width: 100%; margin-top: 8px; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: white;">
            <button id="save-api-key" class="btn btn-primary" style="margin-top: 8px; width: 100%;">Save API Key</button>
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

  // Save API key
  document.getElementById('save-api-key')?.addEventListener('click', () => {
    const apiKeyField = document.getElementById('api-key-field');
    const newKey = apiKeyField?.value?.trim();
    if (newKey) {
      aiCoach.setApiKey(newKey);
      modal.remove();
      location.reload();
    } else {
      alert('Please enter an API key');
    }
  });
}

export default {
  render: renderConversation,
  afterRender: initConversationEvents
};
