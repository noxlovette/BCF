# syntax=docker/dockerfile:1

# Stage 1: Build environment
ARG NODE_VERSION=22.1.0
FROM node:${NODE_VERSION}-alpine as build

# Set a working directory
WORKDIR /app

# Copy the package.json and potentially package-lock.json if you are using npm
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project into the working directory
COPY . .

# Build the application, assume a build script is defined in your package.json
RUN npm run build

# Stage 2: Runtime environment using the same Node.js image
FROM node:${NODE_VERSION}-alpine

# Set a working directory
WORKDIR /app

# Install only production dependencies
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm install --production

# Copy over the built application and node_modules from the build stage
COPY --from=build /app/build /app
COPY --from=build /app/node_modules /app/node_modules

# Expose the port the app runs on
EXPOSE 3000

# Command to start the application
CMD ["node", "index.js"]
