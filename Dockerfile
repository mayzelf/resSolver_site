# Use official Node 21 image
FROM node:21-alpine AS build

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the Nuxt app
RUN pnpm build

# Production image
FROM node:21-alpine

WORKDIR /app

# Install pnpm in production image
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only necessary files from build stage
COPY --from=build /app ./

# Expose port (change if your app uses a different port)
EXPOSE 3000

# Start the Nuxt app
CMD ["pnpm", "start"]
