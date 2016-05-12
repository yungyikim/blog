#!/bin/sh

TEMPDIR=~/tmp
PROJECT_DIR=$HOME/sample

sudo apt-get update
sudo apt-get -y upgrade

# 만약 문제(웹페이지 로딩이 느리다거나 외부에서 디비에 연결이 안되는 등)가 발생하면
# 아래 4개의 스크립트를 수동으로 실행하여라.

# 5.7
bash $PROJECT_DIR/setup/_install_mysql.sh

# 1.10.0
bash $PROJECT_DIR/setup/_install_nginx.sh

# 1.9.4 <
bash $PROJECT_DIR/setup/_install_django.sh

bash $PROJECT_DIR/setup/_install_gulp_packages.sh

# django 관리자 페이지 리소스 생성 & DB migrate
cd $PROJECT_DIR/app
rm -f django.log
python manage.py migrate auth
python manage.py createsuperuser
python manage.py makemigrations api
python manage.py migrate --run-syncdb
python manage.py collectstatic

cd $PROJECT_DIR
rm -f gulpfile.js
mv gulpfile.js.deploy gulpfile.js
gulp
