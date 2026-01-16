# Maggy - English Learning PWA

A gamified English learning Progressive Web App with AI coach powered by Gemini.

## Features

- 🎓 **AI Coach (Maggy)**: Conversational English tutor powered by Gemini
- 🎤 **Voice Interaction**: Speak and listen for pronunciation practice
- 📚 **Structured Lessons**: TO BE, Simple Present, DO/DOES, Pronunciation
- 📝 **Interactive Quizzes**: Test your knowledge with instant feedback
- 🔥 **Gamification**: Streaks, mastery levels, and progress tracking
- 📱 **PWA**: Install on your phone like a native app

## Getting Started

### 1. Local Development

You can use any static server to run the app:

```bash
# Using Python
python3 -m http.server 8000

# Using PHP
php -S localhost:8000

# Using npx (if Node is installed)
npx serve
```

Then open `http://localhost:8000` in your browser.

### 2. Deploy to Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in the project directory
4. Follow the prompts

Or connect your GitHub repo to Vercel for automatic deployments.

### 3. Configure API Key

When you first open the Conversation view, you'll be prompted to enter your Gemini API key.

Get your free API key at: [aistudio.google.com](https://aistudio.google.com)

For production deployment on Vercel, add your API key as an environment variable:
- Name: `GEMINI_API_KEY`
- Value: Your API key

## Project Structure

```
Maggy/
├── index.html          # Main entry point
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── vercel.json        # Vercel config
├── css/
│   ├── design-system.css   # Design tokens & utilities
│   ├── components.css      # UI components
│   └── views.css           # Page styles
├── js/
│   ├── app.js              # Main app
│   ├── router.js           # SPA router
│   ├── data/
│   │   ├── lessons-content.js  # Curriculum
│   │   └── prompts.js          # AI prompts
│   ├── modules/
│   │   ├── ai-coach.js     # Gemini integration
│   │   ├── voice.js        # Speech synthesis/recognition
│   │   ├── progress.js     # IndexedDB storage
│   │   ├── gamification.js # Streaks & mastery
│   │   └── quiz.js         # Quiz engine
│   └── views/
│       ├── home.js
│       ├── lessons.js
│       ├── lesson-detail.js
│       ├── quiz.js
│       ├── conversation.js
│       └── progress.js
└── assets/
    └── icons/          # PWA icons
```

## Tech Stack

- **Frontend**: Vanilla JavaScript (no framework)
- **Styling**: CSS with custom properties
- **Storage**: IndexedDB
- **AI**: Gemini API
- **Voice**: Web Speech API
- **Hosting**: Vercel (static)

## Browser Support

- Chrome (recommended for voice features)
- Safari (iOS)
- Firefox
- Edge

## License

Personal use only.
