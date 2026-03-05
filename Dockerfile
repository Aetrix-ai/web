# ─── Stage 1: Dependencies ───────────────────────────────────────────────────
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci

# ─── Stage 2: Builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Hardcoded env vars baked into the Next.js build
# NEXT_PUBLIC_* vars are inlined at build time by Next.js
ENV NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/px6dnnjku/aetrix/
ENV NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_dcJLwIovDo74N/nimi764eD/dNk=

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ─── Stage 3: Production runner ──────────────────────────────────────────────
FROM node:22-alpine AS production

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Re-declare public env vars so they're available at runtime too
ENV NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/px6dnnjku/aetrix/
ENV NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_dcJLwIovDo74N/nimi764eD/dNk=

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]