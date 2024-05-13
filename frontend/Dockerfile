# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.1.0
FROM node:${NODE_VERSION}

# Install necessary packages
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set a working directory
WORKDIR /app

# Copy the package.json and yarn.lock file
# package-lock.json is not needed since we are using yarn, not npm
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project into the working directory
COPY . .    

# Expose the port the app runs on
EXPOSE 5173

# Command to start the application
CMD ["yarn", "dev"]
