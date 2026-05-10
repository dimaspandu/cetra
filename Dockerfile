# Use the official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build app
RUN npm run build

# Cloud Run uses PORT env
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start app
CMD ["npm", "start"]