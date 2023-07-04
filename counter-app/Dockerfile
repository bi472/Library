FROM node:14

WORKDIR /app

ARG NODE_ENV=production
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
