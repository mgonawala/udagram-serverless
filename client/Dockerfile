FROM node:alpine
WORKDIR /app
COPY ./package.json ./package.json
ENV PATH ./node_modules/.bin:$PATH
RUN yarn
COPY . .
CMD ["npm", "start"]
