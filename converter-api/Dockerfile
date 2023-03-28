# Use the official Node.js runtime as the base image for the builder
FROM node:16-alpine AS builder

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile && \
    yarn cache clean

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN yarn build

# Use the official Node.js runtime as the base image for the application
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install production dependencies using Yarn
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Copy the node modules from the builder image
COPY --from=builder /app/node_modules ./node_modules

# Copy the built application code to the container
COPY --from=builder /app/dist ./dist

# Expose the port that the application will listen on
EXPOSE 4000

# Start the NestJS server
CMD ["node", "dist/main"]
