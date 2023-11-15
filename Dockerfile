# Build Stage
FROM --platform=${TARGETPLATFORM:-linux/arm/v8} node:14-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Final Stage
FROM --platform=${TARGETPLATFORM:-linux/arm/v8} node:14-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "start"]
