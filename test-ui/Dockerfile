# --- Stage 1: Build the Vite React App ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Vite project (generates static files in /app/dist)
RUN npm run build

# --- Stage 2: Serve using Nginx ---
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite build output (dist folder) to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to handle React client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]