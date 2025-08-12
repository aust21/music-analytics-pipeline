# Use the same Node version you're using locally
FROM node:20

WORKDIR /app

# First copy only package files for better caching
COPY package*.json ./

# Install dependencies (including devDependencies for now)
RUN npm install

# Then copy the rest of the files
COPY . .

# Explicitly set the start command
CMD ["node", "server.js"] 