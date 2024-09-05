#!/bin/sh
envsubst '$BACKEND_HOST' < /etc/nginx/conf.d/custom-nginx.template > /etc/nginx/conf.d/default.conf;
envsubst 'BACKEND_OLD_HOST' < /etc/nginx/conf.d/custom-nginx.template > /etc/nginx/conf.d/default.conf;
exec nginx -g "daemon off;";