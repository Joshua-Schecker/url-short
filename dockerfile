FROM node:20.11-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package-lock.json .
COPY package.json .
COPY tsconfig.json .
COPY service_account.json .
COPY .env .
RUN npm install
COPY src/ ./src
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start"]