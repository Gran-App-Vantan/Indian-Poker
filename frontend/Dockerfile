FROM node:22
WORKDIR /frontend

COPY . .
WORKDIR /frontend/next-poker

RUN npm install

CMD ["sh", "-c", "npm install && npm run dev"]
EXPOSE 3000