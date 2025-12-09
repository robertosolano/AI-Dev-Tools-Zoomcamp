# Build Stage for Client
FROM node:18-alpine as client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app

# Setup Server
COPY server/package*.json ./server/
WORKDIR /app/server
ENV NODE_ENV=production
RUN npm install --production

# Copy Server Code
COPY server/ ./

# Copy Client Build to Server's public directory (or specific static folder)
# We need to make sure express serves this.
COPY --from=client-build /app/client/dist ./public

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "index.js"]
