# Use Node.js as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose the port Vite uses
EXPOSE 4173

# Start the Vite preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]

# docker build -t lexi-scan-ui .
# docker run -p 4173:4173 lexi-scan-ui