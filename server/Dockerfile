# server/Dockerfile
FROM node:20-alpine

# Create non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

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

# Ensure node_modules binaries are executable
RUN find ./node_modules/.bin/ -type f -exec chmod +x {} \;

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose API port
EXPOSE 4000

# Health check to ensure the container is running properly
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost:4000/ || exit 1

# Start the server
CMD ["npm", "start"]