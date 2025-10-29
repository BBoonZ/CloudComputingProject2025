# ใช้ Node.js image
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env ./

EXPOSE 3001

# Run server
CMD ["node", "server.js"]
