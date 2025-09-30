FROM node:22
WORKDIR /frontend

COPY . .
WORKDIR /frontend/next-poker

RUN npm install

CMD ["npm", "run", "dev"]
EXPOSE 3000