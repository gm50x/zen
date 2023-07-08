FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
ENV PORT=3000
WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE ${PORT}
CMD ["npm", "run", "start:prod"]