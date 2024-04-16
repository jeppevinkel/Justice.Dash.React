#Stage 1
FROM node:21-alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

#Stage 2
FROM nginx:1.25.4
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
COPY generate-config.sh /usr/local/bin
COPY custom-nginx.template /etc/nginx/conf.d/
RUN chmod +x /usr/local/bin/generate-config.sh
EXPOSE 80
ENTRYPOINT [ "/bin/sh", "/usr/local/bin/generate-config.sh"]
#ENTRYPOINT ["nginx", "-g", "daemon off;"]