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
     - Firebase project configuration (client-side)
     - Gemini API key from Google AI Studio (server-side)

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
    docker run -e GEMINI_API_KEY=your_key_here \
                -e GEMINI_MODEL_NAME=gemini-2.5-flash-lite \
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
          - GEMINI_API_KEY=your_gemini_api_key
          - GEMINI_MODEL_NAME=gemini-2.5-flash-lite
          - VITE_FIREBASE_API_KEY=your_firebase_api_key
          # ... other Firebase variables
    ```

    **Option C: Using deployment platform environment variables**
    Set the following environment variables in your deployment platform (Vercel, Netlify, Railway, etc.):
    - `GEMINI_API_KEY` (server-side only)
    - `GEMINI_MODEL_NAME` (server-side only)
    - `VITE_FIREBASE_API_KEY` (client-side)
    - `VITE_FIREBASE_AUTH_DOMAIN` (client-side)
    - `VITE_FIREBASE_PROJECT_ID` (client-side)
    - `VITE_FIREBASE_STORAGE_BUCKET` (client-side)
    - `VITE_FIREBASE_MESSAGING_SENDER_ID` (client-side)
    - `VITE_FIREBASE_APP_ID` (client-side)

## Tech Stack

- **Frontend**: SolidStart, SolidJS, TypeScript, SCSS Modules
- **Backend**: GraphQL Yoga (for Discovery) & REST API (for Analysis)
- **Database**: Firebase Firestore (Archiving & History)
- **AI**: Gemini API (Vision + Intelligence) & Pollinations.ai (Visual concept generation)
- **Animations**: Motion One

## Project Structure

```
src/
├── ai/              # AI modules (Gemini integration)
├── components/      # Reusable UI components
├── firebase/        # Firebase configuration
├── graphql/         # GraphQL schema and resolvers
├── lib/             # Utility functions
├── routes/          # File-based routing (Home, Discovery Lab, API)
├── styles/          # SCSS architecture
└── root.tsx         # App root & Navigation
```

## Features

- **AI Object Scanning**: Drag & drop image analysis using Gemini Vision.
- **Discovery Lab**: Searchable community archive to browse previous scans.
- **Smart Categorization**: Automatic tagging of items (Kitchen, Electronics, etc.).
- **Visual Concepting**: Re-generation of item visuals via AI prompts (no storage required).
- **Sustainability Impact**: Quantifiable impact for each reuse suggestion.
- **Tutorial Generation**: Step-by-step guides for upcycling projects.

## Contributing

This is a hackathon project focused on rapid prototyping and emotional sustainability experiences.
