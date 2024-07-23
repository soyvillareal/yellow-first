# Stage 1: Build
FROM node:18.17.0-alpine

# Update package list and install curl
RUN apk update

# Install dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Directorio donde se mantendran los archivos de la app
WORKDIR /usr/src/backend

RUN mkdir -p logs/
RUN chown -R node:node logs/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Clean cache
RUN npm cache clean --force

RUN npm set fetch-retry-maxtimeout 1000000
# RUN npm config set registry https://registry.npm.taobao.org

RUN npm install -g pm2

# Instalar dependencias
# RUN npm ci
RUN npm ci --loglevel verbose

# Copiar todos los archivos
COPY . .

# Construir la aplicacion lista para produccion
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

EXPOSE 3000

CMD dockerize -wait tcp://${DB_PORT}:${DB_PORT} -timeout 20s -wait-retry-interval 3s && cd backend && npm run build && pm2 start ecosystem.config.js --env dev --no-daemon