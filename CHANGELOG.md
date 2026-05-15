# Changelog

All notable changes to this project will be documented in this file.

## [1.3.5] - 2026-05-15
### Changed
- **REST-to-DB Architecture**: Replaced the flaky Firestore SDK with the direct Google Firestore REST API for server-side fetching. This provides 100% stability on Cloud Run by using standard HTTP instead of gRPC.
- **Improved Env Reliability**: Enhanced environment variable detection for production SSR.

## [1.3.4] - 2026-05-15
### Fixed
- **Production Stability**: Forced Firestore to use Long Polling (HTTP) on the server to resolve `GRPC error has no .code` issues in Cloud Run.
- **Robust Config**: Enhanced Firebase initialization to correctly detect environment variables in SSR environments.
- **Error Visibility**: Unmasked Firestore error messages in the Discovery Lab to facilitate production debugging.

## [1.3.3] - 2026-05-15
### Added
- **Tutorial Persistence**: AI now generates a 3-step "Preparation Guide" for every item during analysis, which is stored in Firestore for instant viewing in the archive.
- **LoremFlickr Integration**: Switched image provider to LoremFlickr for stable, high-quality material photography in the Discovery Lab.
- **Search Debounce**: Implemented a 500ms debounce on the search input for smooth, automatic filtering without jitter.

### Fixed
- **Image Resilience**: Re-added multi-layer `onError` fallbacks to prevent broken images in the archive grid and modal.
- **TypeScript Alignment**: Synchronized `AnalysisResult` interfaces and initial states across the codebase to resolve build errors.
- **Deep Linking**: Fixed `useSearchParams` hook initialization in the Archive component.

## [1.3.2] - 2026-05-15
### Added
- **Shareable Discovery Lab**: Implemented URL query parameter synchronization (category and search) for shareable filtered views.
- **Analysis Detail Modal**: Added a premium glassmorphism modal to view full scan results, including recyclability details and all reuse suggestions.
- **Image Resilience**: Added automatic fallback placeholders for broken AI-generated images.

### Changed
- **Direct-to-DB Architecture**: Refactored Archive fetching to use direct Firestore access inside `server$` functions, eliminating flaky HTTP self-fetches.
- **Enhanced Debugging**: Unmasked GraphQL errors in development and added detailed server-side Firestore error logging.

### Fixed
- Fixed 'read-only property params' error in SolidStart by bypassing the network layer for internal data fetching.
- Fixed 'All' category filtering to correctly return the full archive list.

## [1.3.1] - 2026-05-15
### Added
- **Client-Side Optimization**: Implemented image compression and resizing (max 1024px) before upload to reduce network latency.
- **Image Validation**: Added 10MB file size limit with user-friendly error messages.
- **Improved UX**: Added upload hints and better error/loading states to the Discovery Lab.

### Changed
- **Optimized Archiving**: Switched to 'Fire and Forget' for Firestore archiving in the REST API for faster AI response times.
- **Production Readiness**: Updated SSR logic to support absolute URLs via `VITE_SITE_URL` environment variable.

### Fixed
- Fixed Sass compilation error caused by missing `$text-xs` variable.
- Fixed TypeScript errors in Archive resource handling.
- Fixed 'All' category filtering in the GraphQL resolver.

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
