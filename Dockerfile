FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available) to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Start the application
CMD ["npm", "run", "start:prod"]
