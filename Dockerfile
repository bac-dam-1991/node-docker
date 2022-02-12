FROM node:16.13.0-alpine
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN if [ "${NODE_ENV}"="development" ]; \
  then npm install; \
  else npm nstall --only=production; \
  fi
COPY . .
ENV PORT 3000 
EXPOSE $PORT
CMD [ "node", "index.js" ]