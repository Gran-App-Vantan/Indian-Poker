FROM node:22
WORKDIR /workdir

COPY . .
WORKDIR /workdir/next_poker
RUN npm install
CMD ["npm", "run", "dev"]
EXPOSE 3000