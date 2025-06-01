FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install --production

EXPOSE 3000

CMD ["node", "app.js"]
