# Production Multi-Stage Dockerfile for Smart Crop Advisory System
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Build Vite client and bundle server
RUN npm run build

# Production Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --only=production

# Copy built assets and server bundle from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./index.html
COPY --from=builder /app/public ./public

EXPOSE 8080

CMD ["npm", "start"]
