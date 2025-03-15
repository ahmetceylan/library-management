FROM node:20

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm i

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]
