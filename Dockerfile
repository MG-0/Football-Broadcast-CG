FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY api/package*.json ./api/
COPY dashboard/package*.json ./dashboard/

# Install dependencies
RUN npm --prefix dashboard install
RUN npm --prefix api install

# Copy source files
COPY . .

# Build React dashboard
RUN npm --prefix dashboard run build

# Set port for Hugging Face Spaces (default 7860)
ENV PORT=7860
EXPOSE 7860

# Start server
CMD ["node", "api/app.js"]
