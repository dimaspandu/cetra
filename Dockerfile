FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Runtime environment variables for server-side operations
# PORT will be set by Cloud Run
ENV GEMINI_API_KEY=""
ENV GEMINI_MODEL_NAME="gemini-2.5-flash-lite"

EXPOSE 8080

CMD ["pnpm", "start"]