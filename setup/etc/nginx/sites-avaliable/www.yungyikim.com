server {
    server_name yungyikim.com;
    return 301 $scheme://www.yungyikim.com$request_uri;
}

server {
    listen 80;
    server_name www.yungyikim.com;

    # 데이터 업로드 용량 제한
    client_max_body_size 5M;
    client_body_buffer_size 128K;
    client_body_temp_path /tmp/;
    client_body_in_file_only on;

	root    /home/ubuntu/blog/dist;
    index   index.html index.htm;

    location = /favicon.ico { access_log off; log_not_found off; }

    location /static/ {
    	root    /home/ubuntu/blog/dist;
    }

    location / {
        include         uwsgi_params;
        uwsgi_pass      unix:///tmp/webapp.sock;
    }

    location ~ \.html$ {
        try_files $uri = 404;
    }

}
