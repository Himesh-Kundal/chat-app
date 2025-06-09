# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies only (for faster caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source files
COPY . .

# Build Next.js and TypeScript server
RUN npm run build:socket

# --- Production Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy production node_modules
COPY --from=builder /app/node_modules ./node_modules

# Copy built Next.js app and server
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
# Copy Next.js app directories and config
COPY --from=builder /app/src ./src
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/next-env.d.ts ./
COPY --from=builder /app/postcss.config.mjs ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.server.json ./

# Expose the port your server listens on
EXPOSE 3000

# Start Server
CMD ["sh", "-c", "node dist/server.mjs"]