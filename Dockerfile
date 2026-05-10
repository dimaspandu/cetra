FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Set default values for environment variables (override in production)
ENV PORT=8080
ENV VITE_GEMINI_MODEL_NAME=gemini-2.5-flash-lite
ENV VITE_GEMINI_API_KEY=""
ENV VITE_FIREBASE_API_KEY=""
ENV VITE_FIREBASE_AUTH_DOMAIN=""
ENV VITE_FIREBASE_PROJECT_ID=""
ENV VITE_FIREBASE_STORAGE_BUCKET=""
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=""
ENV VITE_FIREBASE_APP_ID=""

EXPOSE 8080

CMD ["pnpm", "start"]