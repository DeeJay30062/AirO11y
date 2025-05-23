# Stage 1: build
FROM node:18-alpine AS builder

WORKDIR /app
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: serve
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

CMD ["serve", "-s", "dist", "-l", "3000", "--single"]
