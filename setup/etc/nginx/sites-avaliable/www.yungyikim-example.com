server {
    server_name yungyikim-example.com;
    return 301 $scheme://www.yungyikim-example.com:8000$request_uri;
}

server {
    listen 8000;
    server_name www.yungyikim-example.com;

    # 데이터 업로드 용량 제한
    client_max_body_size 5M;

    rewrite_log on;
    error_log  /tmp/nginx/localhost.error.log debug;

	root    /Users/kimyungyi/documents/Projects/blog/dist;
    index   index.html index.htm;

    location = /favicon.ico { access_log off; log_not_found off; }

    location /static/ {
    	root    /Users/kimyungyi/documents/Projects/blog/dist;
    }

    location / {
        include         uwsgi_params;
        uwsgi_pass      unix:///tmp/webapp.sock;
    }

    location ~ \.html$ {
        try_files $uri = 404;
    }
}
