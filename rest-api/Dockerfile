# Use the official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Build the TypeScript code
RUN yarn build

# Expose the port that the application will listen on
EXPOSE 3000

# Start the Node.js server with Yarn
CMD ["yarn", "start"]
