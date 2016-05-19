server {
    listen 80;
    server_name localhost;

    # 데이터 업로드 용량 제한
    client_max_body_size 5M;

	root    /home/ubuntu/blog/dist;
    index   index.html index.htm;

    location = /favicon.ico { access_log off; log_not_found off; }

    location ~ ^/([0-9]+)/?$ {
        try_files $uri /viewer.html;
    }

    location ~ ^/([0-9]+)/(.*)$ {
        rewrite ^/([0-9])/(.*)$ /$2;
    }

    location / {
        try_files $uri $uri/ @htmlext;
    }

    location ~ \.html$ {
        try_files $uri = 404;
    }

    location @htmlext {
        rewrite ^(.*)$ $1.html last;
    }

    location /api/ {
        include         uwsgi_params;
        uwsgi_pass      unix:///tmp/webapp.sock;
    }
}
