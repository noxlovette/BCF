# syntax=docker/dockerfile:1

# Stage 1: Build environment
ARG NODE_VERSION=22.1.0
FROM node:${NODE_VERSION}-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your project and build
COPY . .
RUN npm run build

# Stage 2: Runtime environment
FROM node:${NODE_VERSION}-alpine as runtime

# Set production environment
ENV NODE_ENV production

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built assets from build stage
COPY --from=build /app/build ./build

# Use non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Command to start the application
CMD ["node", "build/index.js"]