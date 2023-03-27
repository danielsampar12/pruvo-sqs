# Use the official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install production dependencies using Yarn
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Install NestJS CLI globally
RUN yarn global add @nestjs/cli

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN yarn build

# Expose the port that the application will listen on
EXPOSE 4000

# Start the NestJS server
CMD ["node", "dist/main"]
