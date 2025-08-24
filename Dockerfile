# Agies - The Maze Vault Password Manager
# Multi-stage Docker build for production deployment

# Stage 1: Backend Build
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build backend
RUN npm run build:backend

# Stage 2: Frontend Build
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build:frontend

# Stage 3: Production Image
FROM node:18-alpine AS production

# Install security updates
RUN apk update && apk upgrade

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S agies -u 1001

# Set working directory
WORKDIR /app

# Copy built backend
COPY --from=backend-builder --chown=agies:nodejs /app/dist ./dist
COPY --from=backend-builder --chown=agies:nodejs /app/node_modules ./node_modules
COPY --from=backend-builder --chown=agies:nodejs /app/package*.json ./

# Copy built frontend
COPY --from=frontend-builder --chown=agies:nodejs /app/public ./public

# Copy database schema
COPY --chown=agies:nodejs database/ ./database/

# Copy scripts
COPY --chown=agies:nodejs scripts/ ./scripts/

# Create necessary directories
RUN mkdir -p /app/data /app/logs /app/backups
RUN chown -R agies:nodejs /app/data /app/logs /app/backups

# Switch to non-root user
USER agies

# Environment variables
ENV NODE_ENV=production
ENV PORT=3002
ENV CHAKRAVYUHAM_ENABLED=true
ENV AI_GUARDIAN_ENABLED=true
ENV DARK_WEB_MONITORING=true
ENV ZERO_KNOWLEDGE=true

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:$PORT/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Expose port
EXPOSE 3002

# Start the application
CMD ["node", "dist/index.js"]
