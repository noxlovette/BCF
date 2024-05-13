# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-slim as base

# Set a working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --only=production
COPY . .    

# Expose the port the app runs on
EXPOSE 5173

# Run the application
CMD ["node", "app.js"]
