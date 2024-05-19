FROM node:18-alpine3.19

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . /app

EXPOSE 9000

ENTRYPOINT ["npm", "run"]
CMD ["start"]