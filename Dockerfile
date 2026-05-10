# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Cloud Run sets PORT env var, but we can set a default
ENV PORT=8080

# Expose the port the app runs on
EXPOSE $PORT

# Start the application
CMD ["pnpm", "start"]