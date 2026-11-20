FROM nginx:alpine

COPY index.html login.html admin.html styles.css catalog.css responsive.css login.css admin.css store.js login.js admin.js /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
