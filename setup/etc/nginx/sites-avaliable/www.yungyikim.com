server {
    listen 80;
    server_name www.yungyikim.com;

    # 데이터 업로드 용량 제한
    client_max_body_size 5M;

	root    /home/ubuntu/blog/dist;
    index   index.html index.htm;

    location = /favicon.ico { access_log off; log_not_found off; }

    location / {
        try_files $uri $uri/ @htmlext;
    }

    location @htmlext {
        rewrite ^(.*)$ $1.html last;
    }

    location /api/ {
        include         uwsgi_params;
        uwsgi_pass      unix:///tmp/webapp.sock;
    }

    location ~ /tech/?$ {
        try_files $uri /list.html;
    }

    location ~ /tech/edit/?$ {
        try_files $uri /edit.html;
    }

    location ~ /tech/([0-9]+)/?$ {
        rewrite ^/tech/([0-9]+)/?$ /tech/$1.html;
    }

    location ~ /info/?$ {
        try_files $uri /list.html;
    }

    location ~ /info/edit/?$ {
        try_files $uri /edit.html;
    }

    location ~ /info/([0-9]+)/?$ {
        rewrite ^/info/([0-9]+)/?$ /info/$1.html;
    }


    location ~ \.html$ {
        try_files $uri = 404;
    }

}
