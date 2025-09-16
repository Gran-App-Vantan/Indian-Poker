FROM node:22
WORKDIR /workdir

COPY . .
WORKDIR /workdir/indian_poker
RUN npm install
CMD ["npm", "run", "dev"]
EXPOSE 3000