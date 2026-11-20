FROM node:22-alpine

WORKDIR /app
COPY api/package*.json ./api/

WORKDIR /app/api
RUN npm ci --omit=dev

COPY api/server.js api/database.js ./
COPY api/test ./test
COPY catalog.json ../catalog.json
COPY database/init.sql ../database/init.sql

USER node
EXPOSE 3000

CMD ["npm", "start"]
