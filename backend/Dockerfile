# Dockerfile for Node.js Server
FROM node:20 as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Production stage
FROM node:20-slim

WORKDIR /app

# Create non-root user for security
RUN groupadd -r nodeuser && useradd -r -g nodeuser nodeuser


# Switch to non-root user
USER nodeuser

# Expose the port your app runs on
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]