FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove source code and dev dependencies to reduce image size
RUN rm -rf src tsconfig.json

EXPOSE 8080

ENV NODE_ENV=production

CMD ["npm", "start"]
