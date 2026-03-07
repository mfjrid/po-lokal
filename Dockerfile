# Multi-stage build for Next.js 15
FROM node:18-alpine AS base

# 1. Dependencies and Build
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and prisma
COPY . .
RUN npx prisma generate

# Build application
RUN npm run build

# 2. Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Set port to 3006
ENV PORT 3006
ENV HOSTNAME "0.0.0.0"

# Create a non-privileged user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3006

# Use start script
CMD ["npm", "start"]
