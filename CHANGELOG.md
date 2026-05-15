# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-05-15
### Added
- **Discovery Lab**: A new searchable archive of AI-scanned items.
- **GraphQL Integration**: Implemented GraphQL Yoga for Discovery Lab queries (filtering, searching, and list management).
- **History/Archive Persistence**: All successful scans are now automatically archived in Firebase Firestore.
- **Premium Navigation**: Added a floating, glassmorphism-style global navigation bar.
- **Visual Prompting**: Items are now archived with "itemImagePrompt" strings to regenerate visuals on-the-fly, saving storage costs.

### Changed
- **Hybrid Architecture**: Switched to a robust Hybrid model using REST for heavy image analysis payloads and GraphQL for data-rich discovery features.
- **AI Enhancement**: Updated Gemini prompts to provide deeper categorization (e.g., Kitchen, Electronics) and detailed visual descriptions.

### Fixed
- Fixed SSR (Server-Side Rendering) fetch issues by implementing absolute URL detection in SolidStart.
- Fixed layout overlap issues between the fixed navigation bar and page content.
- Resolved various TypeScript alignment issues across components and resolvers.

## [1.2.2] - 2026-05-12
### Added
- Activated the learn more button to fetch suggestion's tutorial

### Fixed
- Handled broken images on suggestions section
- Fixed styling and api key

### Chore
- Checkpoint

## [1.2.1] - 2026-05-10
### Fixed
- Resolved Cloud Run deployment issues by removing build-time environment variables
- Fixed lazy Gemini API initialization to prevent startup crashes
- Added proper error handling for missing API keys in API routes
- Updated Cloud Build configuration for runtime environment variable injection

### Infrastructure
- Updated cloudbuild.yaml to inject environment variables at deploy time
- Added .solid/ directory to .gitignore
- Improved Dockerfile configuration for production deployment

## [1.2.0] - 2026-05-10
### Security
- Moved Gemini API integration from client-side to server-side API routes
- Removed VITE_GEMINI_* environment variables to prevent API key exposure
- Implemented secure server-side API key management with process.env

### Architecture
- Created dedicated API routes: /api/analyze, /api/tutorial, /api/generate-image
- Updated frontend to use fetch() calls instead of direct Gemini API access
- Implemented progressive image generation UX with loading states

### Infrastructure
- Updated Dockerfile to handle runtime environment variables only
- Modified environment variable configuration for production deployment
- Enhanced deployment documentation in README

## [1.1.0] - 2026-05-10
### Fixed
- Fixed TypeScript compilation errors in gemini.ts (template literal syntax and missing properties)
- Fixed crossorigin attribute in root.tsx for proper HTML validation
- Resolved all TypeScript errors in UploadArea component

### Refactored
- Converted UploadArea component from inline styles to SCSS modules for better maintainability
- Moved UploadArea component to dedicated subdirectory structure
- Improved code organization and separation of concerns

### Improved
- Enhanced type safety across the codebase
- Better CSS architecture with modular SCSS approach

## [1.0.0] - 2026-05-10
### Added
- Initial release of CETRA: AI-powered sustainability companion
- Drag & drop image upload with AI analysis
- Google Gemini integration for object recognition and reuse suggestions
- Modern light theme with Poppins and Orbitron fonts
- Cinematic UI with Motion One animations
- Dockerfile for containerization
- ESLint configuration for code quality
- Environment variable template (.env.example)
- Comprehensive README and VISION documents
