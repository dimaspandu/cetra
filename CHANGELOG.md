# Changelog

All notable changes to this project will be documented in this file.

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
