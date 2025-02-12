# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight HTTP server to serve the app
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3001

# Command to run the app on port 3001
CMD ["serve", "-s", "build", "-l", "3001"]