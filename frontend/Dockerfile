FROM node:18.17.0-alpine as builder

# Update package list and install curl
RUN apk update

# Directorio donde se mantendran los archivos de la app
WORKDIR /usr/src/frontend

ENV PATH /usr/src/frontend/node_modules/.bin:$PATH
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Clean cache
RUN npm cache clean --force

RUN npm set fetch-retry-maxtimeout 1000000
# RUN npm config set registry https://registry.npm.taobao.org

# Instalar dependencias
# RUN npm ci
RUN npm ci --loglevel verbose

# Copiar todos los archivos
COPY . .

RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build:prod --loglevel verbose

# production environment
FROM nginx:1.21.1-alpine

# Copy configuration of Nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy files to the app
COPY --from=builder /usr/src/frontend/build /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]