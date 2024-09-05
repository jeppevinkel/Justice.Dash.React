#!/bin/sh
envsubst '$BACKEND_HOST,$BACKEND_OLD_HOST' < /etc/nginx/conf.d/custom-nginx.template > /etc/nginx/conf.d/default.conf;
exec nginx -g "daemon off;";