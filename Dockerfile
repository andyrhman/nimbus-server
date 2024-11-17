# Build dependencies
FROM node:20.17 AS dependencies
WORKDIR /app
COPY prisma ./
COPY package.json .
RUN npm install
COPY . .

# Build production image
FROM dependencies AS builder
RUN npm run build
EXPOSE 465 25 587
EXPOSE 8000
CMD ["npm", "run", "start"]
