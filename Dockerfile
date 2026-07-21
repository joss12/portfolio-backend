# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm through Node.js Corepack
RUN corepack enable

# Copy dependency files first for better Docker caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies, including TypeScript
RUN pnpm install --frozen-lockfile

# Copy the TypeScript configuration and source code
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript into JavaScript
RUN pnpm build


# ---------- Production stage ----------
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Enable pnpm in the production image
RUN corepack enable

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy compiled JavaScript from the build stage
COPY --from=builder /app/dist ./dist

# The backend listens on port 8086
EXPOSE 8086

# Run the compiled application
CMD ["pnpm", "start"]
