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

7. **Deploy to production**

    For production deployment, ensure environment variables are set:

    **Option A: Using Docker environment variables**
    ```bash
    docker run -e VITE_GEMINI_API_KEY=your_key_here \
                -e VITE_GEMINI_MODEL_NAME=gemini-2.5-flash-lite \
                -e VITE_FIREBASE_API_KEY=your_firebase_key \
                your-image-name
    ```

    **Option B: Using docker-compose.yml**
    ```yaml
    version: '3.8'
    services:
      cetra:
        build: .
        ports:
          - "8080:8080"
        environment:
          - VITE_GEMINI_API_KEY=your_gemini_api_key
          - VITE_GEMINI_MODEL_NAME=gemini-2.5-flash-lite
          - VITE_FIREBASE_API_KEY=your_firebase_api_key
          # ... other Firebase variables
    ```

    **Option C: Using deployment platform environment variables**
    Set the following environment variables in your deployment platform (Vercel, Netlify, Railway, etc.):
    - `VITE_GEMINI_API_KEY`
    - `VITE_GEMINI_MODEL_NAME`
    - `VITE_FIREBASE_API_KEY`
    - `VITE_FIREBASE_AUTH_DOMAIN`
    - `VITE_FIREBASE_PROJECT_ID`
    - `VITE_FIREBASE_STORAGE_BUCKET`
    - `VITE_FIREBASE_MESSAGING_SENDER_ID`
    - `VITE_FIREBASE_APP_ID`

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
