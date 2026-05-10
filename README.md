# CETRA

Not everything discarded has lost its value. CETRA is an AI-powered sustainability companion that bridges the imagination gap, giving you a "second sight" to see the hidden potential in everyday objects before you throw them away.

## Setup Instructions

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd cetra
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Configure environment variables**

    Copy `.env.example` to `.env` and fill in your API keys:
    - Firebase project configuration
    - Gemini API key from Google AI Studio

4. **Set up Firebase**
    - Create a Firebase project
    - Enable Firestore and Storage
    - Update `.env` with your Firebase config

5. **Run the development server**

    ```bash
    pnpm dev
    ```

6. **Build for production**
    ```bash
    pnpm build
    pnpm start
    ```

## Tech Stack

- **Frontend**: SolidStart, SolidJS, TypeScript, SCSS Modules
- **Backend**: GraphQL Yoga
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI**: Gemini API (Vision + Intelligence)
- **Animations**: Motion One

## Project Structure

```
src/
├── ai/              # AI modules (Gemini integration)
├── components/      # Reusable UI components
├── firebase/        # Firebase configuration
├── graphql/         # GraphQL schema and resolvers
├── lib/             # Utility functions
├── pages/           # Page components (if needed)
├── routes/          # File-based routing
├── styles/          # SCSS architecture
│   ├── abstracts/   # Variables, mixins, animations
│   ├── base/        # Reset, globals, typography
│   ├── components/  # Component-specific styles
│   ├── layouts/     # Layout styles
│   └── pages/       # Page-specific styles
└── root.tsx         # App root
```

## Features

- Drag & drop image upload
- AI-powered object analysis
- Reuse suggestions (DIY, recipes, resale, etc.)
- Cinematic UI with animations
- Sustainability impact tracking
- Community sharing (planned)

## Contributing

This is a hackathon project focused on rapid prototyping and emotional sustainability experiences.
