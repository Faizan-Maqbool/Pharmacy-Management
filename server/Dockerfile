# server/Dockerfile
FROM node:20-alpine
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy application code
COPY . .

# Set environment variables with defaults
ENV NODE_ENV=production
ENV PORT=4000
# The actual MongoDB URI will be provided via docker-compose

# Expose API port
EXPOSE 4000

# Health check to ensure the container is running properly
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost:4000/ || exit 1

# Start the server
CMD ["npm", "start"]