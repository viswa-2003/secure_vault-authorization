FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["sh", "./docker/entrypoint.sh"]
RUN chmod +x ./docker/entrypoint.sh

