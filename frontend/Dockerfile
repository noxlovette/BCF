# syntax=docker/dockerfile:1

# Stage 1: Build environment
FROM oven/bun:1 as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN bun install --frozen-lockfile

# Copy the rest of your project and build
COPY . .
RUN bun run build

# Stage 2: Runtime environment
FROM oven/bun:1-alpine as runtime

# Set production environment
ENV NODE_ENV staging
ENV VITE_API_URL=http://backend:8000

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN bun install --frozen-lockfile --production

# Copy built assets from build stage
COPY --from=build /app/build ./build

# Use non-root user
RUN addgroup -g 1001 -S bunjs && \
    adduser -S bunjs -u 1001 && \
    chown -R bunjs:bunjs /app
USER bunjs

# Expose the port the app runs on
EXPOSE 3000

# Command to start the application
CMD ["bun", "build/index.js"]