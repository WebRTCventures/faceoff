# Use the official Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including dotenv and other required packages
RUN npm install

# Copy the application code
COPY . .

# Expose port 3001 (the port used in server.js)
EXPOSE 3001

# Command to run the application on startup
CMD ["node", "server.js"]