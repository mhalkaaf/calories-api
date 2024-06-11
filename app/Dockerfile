FROM node:18-slim

RUN mkdir -p /app

WORKDIR /app

ARG APPENV

COPY package.json package-lock.json ./

RUN npm install

RUN echo -e $APPENV > .env.production

COPY . /app

EXPOSE 3000

ENTRYPOINT ["npm", "run"]
CMD ["start"]