FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run compile

EXPOSE 8000

CMD ["npm", "start"]