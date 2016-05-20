server {
    listen 80;
    server_name localhost;

    # 데이터 업로드 용량 제한
    client_max_body_size 5M;

	root    /home/ubuntu/blog/dist;
    index   index.html index.htm;

    location = /favicon.ico { access_log off; log_not_found off; }

    location /api/ {
        include         uwsgi_params;
        uwsgi_pass      unix:///tmp/webapp.sock;
    }

    location ~ ^/([0-9]+)/?$ {
        try_files $uri /viewer.html;
    }

    location ~ ^/([0-9]+)/(.*)$ {
        rewrite ^/([0-9])/(.*)$ /$2;
    }

    location / {
        try_files $uri $uri/ @htmlext;
    }

    location @htmlext {
        rewrite ^(.*)$ $1.html last;
    }

    location ~ ^/tech/?$ {
        try_files $uri /list.html;
    }

    location ~ ^/tech/([a-zA-Z]+)/?$ {
        try_files $uri /edit.html;
    }

    location ~ ^/info/?$ {
        try_files $uri /list.html;
    }

    location ~ ^/info/([a-zA-Z]+)/?$ {
        try_files $uri /edit.html;
    }

    location ~ ^/([a-zA-Z]+)/([0-9]+)/?$ {
        try_files $uri /view.html;
    }

    location ~ \.html$ {
        try_files $uri = 404;
    }

}
